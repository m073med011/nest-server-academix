import { TermRepository } from './term.repository';
import { LevelRepository } from './level.repository';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { Types } from 'mongoose';
import { OrganizationsService } from '../organizations/organizations.service';
export declare class TermService {
    private readonly termRepository;
    private readonly levelRepository;
    private readonly organizationsService;
    constructor(termRepository: TermRepository, levelRepository: LevelRepository, organizationsService: OrganizationsService);
    create(levelId: string, createTermDto: CreateTermDto): Promise<import("mongoose").Document<unknown, {}, import("../organizations/schemas/term.schema").Term, {}, {}> & import("../organizations/schemas/term.schema").Term & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(levelId: string): Promise<(import("mongoose").Document<unknown, {}, import("../organizations/schemas/term.schema").Term, {}, {}> & import("../organizations/schemas/term.schema").Term & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(levelId: string, termId: string): Promise<import("mongoose").Document<unknown, {}, import("../organizations/schemas/term.schema").Term, {}, {}> & import("../organizations/schemas/term.schema").Term & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(levelId: string, termId: string, updateTermDto: UpdateTermDto): Promise<import("mongoose").Document<unknown, {}, import("../organizations/schemas/term.schema").Term, {}, {}> & import("../organizations/schemas/term.schema").Term & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    remove(levelId: string, termId: string): Promise<import("mongoose").Document<unknown, {}, import("../organizations/schemas/term.schema").Term, {}, {}> & import("../organizations/schemas/term.schema").Term & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
}
