import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelController } from './level.controller';
import { LevelService } from './level.service';
import { LevelRepository } from './level.repository';
import { Level, LevelSchema } from './schemas/level.schema';
import { Term, TermSchema } from '../organizations/schemas/term.schema';
import { TermController } from './term.controller';
import { TermService } from './term.service';
import { TermRepository } from './term.repository';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Level.name, schema: LevelSchema },
      { name: Term.name, schema: TermSchema },
    ]),
    forwardRef(() => OrganizationsModule),
  ],
  controllers: [LevelController, TermController],
  providers: [LevelService, LevelRepository, TermService, TermRepository],
  exports: [LevelService, TermService],
})
export class LevelModule {}
