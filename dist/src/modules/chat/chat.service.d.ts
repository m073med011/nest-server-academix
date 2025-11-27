import { ChatRepository } from './chat.repository';
export declare class ChatService {
    private readonly chatRepository;
    constructor(chatRepository: ChatRepository);
    create(createChatDto: any): Promise<import("./schemas/chat.schema").ChatDocument>;
    findAll(): Promise<import("./schemas/chat.schema").ChatDocument[]>;
    findOne(id: string): Promise<import("./schemas/chat.schema").ChatDocument | null>;
    findByParticipant(userId: string): Promise<import("./schemas/chat.schema").ChatDocument[]>;
    update(id: string, updateChatDto: any): Promise<import("./schemas/chat.schema").ChatDocument | null>;
    remove(id: string): Promise<import("./schemas/chat.schema").ChatDocument | null>;
}
