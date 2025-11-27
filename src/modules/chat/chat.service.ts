import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  create(createChatDto: any) {
    return this.chatRepository.create(createChatDto);
  }

  findAll() {
    return this.chatRepository.findAll();
  }

  findOne(id: string) {
    return this.chatRepository.findById(id);
  }

  findByParticipant(userId: string) {
    return this.chatRepository.findByParticipant(userId);
  }

  update(id: string, updateChatDto: any) {
    return this.chatRepository.update(id, updateChatDto);
  }

  remove(id: string) {
    return this.chatRepository.delete(id);
  }
}
