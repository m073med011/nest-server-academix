import { Model } from 'mongoose';
import { ChatDocument } from './schemas/chat.schema';
export declare class ChatRepository {
    private chatModel;
    constructor(chatModel: Model<ChatDocument>);
    create(createChatDto: any): Promise<ChatDocument>;
    findAll(): Promise<ChatDocument[]>;
    findById(id: string): Promise<ChatDocument | null>;
    findByParticipant(userId: string): Promise<ChatDocument[]>;
    update(id: string, updateChatDto: any): Promise<ChatDocument | null>;
    delete(id: string): Promise<ChatDocument | null>;
}
