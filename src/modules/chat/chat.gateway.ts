import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { Logger, UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins for now, should be restricted in production
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const token =
        socket.handshake.auth.token ||
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

      // Join user to their rooms
      await this.joinUserRooms(socket, userId);
    } catch (error) {
      this.logger.error(
        `Authentication failed for socket ${socket.id}: ${error.message}`,
      );
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;
    if (userId) {
      this.userSockets.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  private async joinUserRooms(socket: Socket, userId: string) {
    // Join system chat room
    socket.join('system-chat');

    // Join user's private and course chat rooms
    const userChats = await this.chatService.findByParticipant(userId);
    userChats.forEach((chat) => {
      socket.join(chat._id.toString());
    });
  }

  @SubscribeMessage('private-message')
  async handlePrivateMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { recipientId: string; content: string },
  ) {
    const { recipientId, content } = data;
    const senderId = socket.data.userId;

    try {
      // Logic to find or create chat and save message would go here
      // For now, we'll just emit back to simulate functionality or implement fully if ChatService supports it
      // Since ChatService.create is generic, we might need to extend it or use repositories directly if logic is complex

      // Placeholder for full implementation
      this.logger.log(
        `Private message from ${senderId} to ${recipientId}: ${content}`,
      );
    } catch (error) {
      socket.emit('message-error', { error: 'Failed to send message' });
    }
  }

  @SubscribeMessage('course-message')
  async handleCourseMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { courseId: string; content: string },
  ) {
    const { courseId, content } = data;
    const senderId = socket.data.userId;
    this.logger.log(
      `Course message from ${senderId} in ${courseId}: ${content}`,
    );
  }

  @SubscribeMessage('system-message')
  async handleSystemMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { content: string },
  ) {
    const { content } = data;
    const senderId = socket.data.userId;
    this.logger.log(`System message from ${senderId}: ${content}`);
    this.server.to('system-chat').emit('new-message', {
      content,
      senderId,
      chatId: 'system-chat',
    });
  }

  @SubscribeMessage('typing-start')
  handleTypingStart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    socket.to(data.chatId).emit('user-typing', {
      userId: socket.data.userId,
      chatId: data.chatId,
    });
  }

  @SubscribeMessage('typing-stop')
  handleTypingStop(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    socket.to(data.chatId).emit('user-stopped-typing', {
      userId: socket.data.userId,
      chatId: data.chatId,
    });
  }

  @SubscribeMessage('join-chat')
  handleJoinChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    socket.join(data.chatId);
  }

  @SubscribeMessage('leave-chat')
  handleLeaveChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    socket.leave(data.chatId);
  }
}
