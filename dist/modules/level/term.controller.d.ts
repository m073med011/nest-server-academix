import { TermService } from './term.service';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
export declare class TermController {
    private readonly termService;
    constructor(termService: TermService);
    create(levelId: string, createTermDto: CreateTermDto): Promise<import("mongoose").Document<unknown, {}, import("../organizations/schemas/term.schema").Term, {}, {}> & import("../organizations/schemas/term.schema").Term & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(levelId: string): Promise<(import("mongoose").Document<unknown, {}, import("../organizations/schemas/term.schema").Term, {}, {}> & import("../organizations/schemas/term.schema").Term & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(levelId: string, termId: string): Promise<import("mongoose").Document<unknown, {}, import("../organizations/schemas/term.schema").Term, {}, {}> & import("../organizations/schemas/term.schema").Term & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(levelId: string, termId: string, updateTermDto: UpdateTermDto): Promise<import("mongoose").Document<unknown, {}, import("../organizations/schemas/term.schema").Term, {}, {}> & import("../organizations/schemas/term.schema").Term & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    remove(levelId: string, termId: string): Promise<import("mongoose").Document<unknown, {}, import("../organizations/schemas/term.schema").Term, {}, {}> & import("../organizations/schemas/term.schema").Term & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
