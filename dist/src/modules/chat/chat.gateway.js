"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const chat_service_1 = require("./chat.service");
const users_service_1 = require("../users/users.service");
const common_1 = require("@nestjs/common");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    jwtService;
    chatService;
    usersService;
    server;
    logger = new common_1.Logger(ChatGateway_1.name);
    userSockets = new Map();
    constructor(jwtService, chatService, usersService) {
        this.jwtService = jwtService;
        this.chatService = chatService;
        this.usersService = usersService;
    }
    async handleConnection(socket) {
        try {
            const token = socket.handshake.auth.token ||
                socket.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                this.logger.warn(`No token provided for socket ${socket.id}`);
                socket.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const userId = payload.sub;
            socket.data.userId = userId;
            this.userSockets.set(userId, socket.id);
            this.logger.log(`User ${userId} connected with socket ${socket.id}`);
            await this.joinUserRooms(socket, userId);
        }
        catch (error) {
            this.logger.error(`Authentication failed for socket ${socket.id}: ${error.message}`);
            socket.disconnect();
        }
    }
    handleDisconnect(socket) {
        const userId = socket.data.userId;
        if (userId) {
            this.userSockets.delete(userId);
            this.logger.log(`User ${userId} disconnected`);
        }
    }
    async joinUserRooms(socket, userId) {
        socket.join('system-chat');
        const userChats = await this.chatService.findByParticipant(userId);
        userChats.forEach((chat) => {
            socket.join(chat._id.toString());
        });
    }
    async handlePrivateMessage(socket, data) {
        const { recipientId, content } = data;
        const senderId = socket.data.userId;
        try {
            this.logger.log(`Private message from ${senderId} to ${recipientId}: ${content}`);
        }
        catch (error) {
            socket.emit('message-error', { error: 'Failed to send message' });
        }
    }
    async handleCourseMessage(socket, data) {
        const { courseId, content } = data;
        const senderId = socket.data.userId;
        this.logger.log(`Course message from ${senderId} in ${courseId}: ${content}`);
    }
    async handleSystemMessage(socket, data) {
        const { content } = data;
        const senderId = socket.data.userId;
        this.logger.log(`System message from ${senderId}: ${content}`);
        this.server.to('system-chat').emit('new-message', {
            content,
            senderId,
            chatId: 'system-chat',
        });
    }
    handleTypingStart(socket, data) {
        socket.to(data.chatId).emit('user-typing', {
            userId: socket.data.userId,
            chatId: data.chatId,
        });
    }
    handleTypingStop(socket, data) {
        socket.to(data.chatId).emit('user-stopped-typing', {
            userId: socket.data.userId,
            chatId: data.chatId,
        });
    }
    handleJoinChat(socket, data) {
        socket.join(data.chatId);
    }
    handleLeaveChat(socket, data) {
        socket.leave(data.chatId);
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('private-message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handlePrivateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('course-message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleCourseMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('system-message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSystemMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing-start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing-stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTypingStop", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoinChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleLeaveChat", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        chat_service_1.ChatService,
        users_service_1.UsersService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map