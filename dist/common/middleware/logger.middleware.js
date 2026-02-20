"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
let LoggerMiddleware = class LoggerMiddleware {
    logger = new common_1.Logger('HTTP');
    use(req, res, next) {
        const { method, originalUrl, query, body, headers } = req;
        const startTime = Date.now();
        this.logger.log(`\n================================================================================\nIncoming Request: ${method} ${originalUrl}\n================================================================================`);
        this.logger.debug(`[Req] Headers: ${JSON.stringify(headers, null, 2)}`);
        if (Object.keys(query).length > 0) {
            this.logger.debug(`[Req] Query: ${JSON.stringify(query, null, 2)}`);
        }
        if (body && Object.keys(body).length > 0) {
            this.logger.debug(`[Req] Body: ${JSON.stringify(body, null, 2)}`);
        }
        const oldWrite = res.write;
        const oldEnd = res.end;
        const chunks = [];
        res.write = (...args) => {
            chunks.push(Buffer.from(args[0]));
            return oldWrite.apply(res, args);
        };
        res.end = (...args) => {
            if (args[0]) {
                chunks.push(Buffer.from(args[0]));
            }
            return oldEnd.apply(res, args);
        };
        res.on('finish', () => {
            const { statusCode, statusMessage } = res;
            const responseTime = Date.now() - startTime;
            const resHeaders = res.getHeaders();
            const responseBody = Buffer.concat(chunks).toString('utf8');
            this.logger.log(`\n--------------------------------------------------------------------------------\nResponse: ${method} ${originalUrl} ${statusCode} ${statusMessage} - ${responseTime}ms\n--------------------------------------------------------------------------------`);
            this.logger.debug(`[Res] Headers: ${JSON.stringify(resHeaders, null, 2)}`);
            try {
                const jsonBody = JSON.parse(responseBody);
                this.logger.debug(`[Res] Body: ${JSON.stringify(jsonBody, null, 2)}`);
            }
            catch {
                this.logger.debug(`[Res] Body: ${responseBody}`);
            }
        });
        next();
    }
};
exports.LoggerMiddleware = LoggerMiddleware;
exports.LoggerMiddleware = LoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggerMiddleware);
//# sourceMappingURL=logger.middleware.js.map