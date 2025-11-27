import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly chatService;
    private readonly usersService;
    server: Server;
    private readonly logger;
    private userSockets;
    constructor(jwtService: JwtService, chatService: ChatService, usersService: UsersService);
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): void;
    private joinUserRooms;
    handlePrivateMessage(socket: Socket, data: {
        recipientId: string;
        content: string;
    }): Promise<void>;
    handleCourseMessage(socket: Socket, data: {
        courseId: string;
        content: string;
    }): Promise<void>;
    handleSystemMessage(socket: Socket, data: {
        content: string;
    }): Promise<void>;
    handleTypingStart(socket: Socket, data: {
        chatId: string;
    }): void;
    handleTypingStop(socket: Socket, data: {
        chatId: string;
    }): void;
    handleJoinChat(socket: Socket, data: {
        chatId: string;
    }): void;
    handleLeaveChat(socket: Socket, data: {
        chatId: string;
    }): void;
}
