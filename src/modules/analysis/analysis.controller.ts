import { Controller, Get, Param } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('instructor/:instructorId/count')
  getInstructorAnalysisSummary(@Param('instructorId') instructorId: string) {
    return this.analysisService.getInstructorAnalysisSummary(instructorId);
  }
}
