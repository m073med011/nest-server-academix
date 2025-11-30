"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonConfig = void 0;
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
exports.winstonConfig = {
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), nest_winston_1.utilities.format.nestLike('NestServer', {
                colors: true,
                prettyPrint: true,
            })),
        }),
        ...(process.env.NODE_ENV !== 'production' && !process.env.VERCEL
            ? [
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                }),
            ]
            : []),
    ],
};
//# sourceMappingURL=winston.config.js.map