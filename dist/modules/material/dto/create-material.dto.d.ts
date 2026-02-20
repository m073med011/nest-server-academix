import { MaterialType } from '../schemas/material.schema';
declare class QuizQuestionDto {
    text: string;
    options: string[];
    correctAnswer: string;
}
export declare class CreateMaterialDto {
    courseId: string;
    title: string;
    description?: string;
    type: MaterialType;
    moduleId?: string;
    order?: number;
    isPublished?: boolean;
    content?: string;
    url?: string;
    duration?: number;
    isFreePreview?: boolean;
    allowDownloads?: boolean;
    thumbnailUrl?: string;
    points?: number;
    dueDate?: Date;
    submissionTypes?: string[];
    allowLate?: boolean;
    assignmentFileUrl?: string;
    quizQuestions?: QuizQuestionDto[];
    openInNewTab?: boolean;
}
export {};
