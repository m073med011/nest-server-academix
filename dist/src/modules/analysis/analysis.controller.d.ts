import { AnalysisService } from './analysis.service';
export declare class AnalysisController {
    private readonly analysisService;
    constructor(analysisService: AnalysisService);
    getInstructorAnalysisSummary(instructorId: string): Promise<{
        instructorId: string;
        instructorName: string;
        ownCourseCount: number;
        purchasedCourseCount: number;
        totalRevenue: number;
        totalStudents: number;
    }>;
}
