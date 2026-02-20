import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body, headers } = req;
    const startTime = Date.now();

    // Log Incoming Request with Separator
    this.logger.log(
      `\n================================================================================\nIncoming Request: ${method} ${originalUrl}\n================================================================================`,
    );
    this.logger.debug(`[Req] Headers: ${JSON.stringify(headers, null, 2)}`);

    if (Object.keys(query).length > 0) {
      this.logger.debug(`[Req] Query: ${JSON.stringify(query, null, 2)}`);
    }

    if (body && Object.keys(body).length > 0) {
      this.logger.debug(`[Req] Body: ${JSON.stringify(body, null, 2)}`);
    }

    // Capture Response Body
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks: Buffer[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.write = (...args: any[]): boolean => {
      chunks.push(Buffer.from(args[0]));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return oldWrite.apply(res, args as any);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.end = (...args: any[]): Response => {
      if (args[0]) {
        chunks.push(Buffer.from(args[0]));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return oldEnd.apply(res, args as any);
    };

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      const responseTime = Date.now() - startTime;
      const resHeaders = res.getHeaders();
      const responseBody = Buffer.concat(chunks).toString('utf8');

      this.logger.log(
        `\n--------------------------------------------------------------------------------\nResponse: ${method} ${originalUrl} ${statusCode} ${statusMessage} - ${responseTime}ms\n--------------------------------------------------------------------------------`,
      );
      this.logger.debug(
        `[Res] Headers: ${JSON.stringify(resHeaders, null, 2)}`,
      );

      try {
        const jsonBody = JSON.parse(responseBody);
        this.logger.debug(`[Res] Body: ${JSON.stringify(jsonBody, null, 2)}`);
      } catch {
        this.logger.debug(`[Res] Body: ${responseBody}`);
      }
    });

    next();
  }
}
