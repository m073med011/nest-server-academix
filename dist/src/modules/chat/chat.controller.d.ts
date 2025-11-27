import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    create(createChatDto: any): Promise<import("./schemas/chat.schema").ChatDocument>;
    findAll(req: any): Promise<import("./schemas/chat.schema").ChatDocument[]>;
    findOne(id: string): Promise<import("./schemas/chat.schema").ChatDocument | null>;
    update(id: string, updateChatDto: any): Promise<import("./schemas/chat.schema").ChatDocument | null>;
    remove(id: string): Promise<import("./schemas/chat.schema").ChatDocument | null>;
}
