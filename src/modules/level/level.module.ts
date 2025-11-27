import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelController } from './level.controller';
import { LevelService } from './level.service';
import { LevelRepository } from './level.repository';
import { Level, LevelSchema } from './schemas/level.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Level.name, schema: LevelSchema }]),
  ],
  controllers: [LevelController],
  providers: [LevelService, LevelRepository],
  exports: [LevelService],
})
export class LevelModule {}
