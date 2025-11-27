import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';

@Injectable()
export class ChatRepository {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async create(createChatDto: any): Promise<ChatDocument> {
    const newChat = new this.chatModel(createChatDto);
    return newChat.save();
  }

  async findAll(): Promise<ChatDocument[]> {
    return this.chatModel.find().exec();
  }

  async findById(id: string): Promise<ChatDocument | null> {
    return this.chatModel.findById(id).exec();
  }

  async findByParticipant(userId: string): Promise<ChatDocument[]> {
    return this.chatModel.find({ participants: userId }).exec();
  }

  async update(id: string, updateChatDto: any): Promise<ChatDocument | null> {
    return this.chatModel
      .findByIdAndUpdate(id, updateChatDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<ChatDocument | null> {
    return this.chatModel.findByIdAndDelete(id).exec();
  }
}
