"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let stack;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'object' && 'message' in res) {
                message = Array.isArray(res.message)
                    ? res.message.join(', ')
                    : res.message;
            }
            else if (typeof res === 'string') {
                message = res;
            }
        }
        else if (exception instanceof Error) {
            if (exception.name === 'CastError') {
                status = common_1.HttpStatus.NOT_FOUND;
                message = 'Resource not found';
            }
            else if (exception.code === 11000) {
                status = common_1.HttpStatus.BAD_REQUEST;
                message = 'Duplicate field value entered';
            }
            else if (exception.name === 'ValidationError') {
                status = common_1.HttpStatus.BAD_REQUEST;
                const errors = Object.values(exception.errors).map((e) => e.message);
                message = errors.join(', ');
            }
            else {
                message = exception.message;
            }
            stack = exception.stack;
        }
        this.logger.error(`${request.method} ${request.url} - ${status} - ${message}`, stack);
        const errorResponse = {
            success: false,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        if (process.env.NODE_ENV === 'development' && stack) {
            errorResponse.stack = stack;
        }
        response.status(status).json(errorResponse);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map