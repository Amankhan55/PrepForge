import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { UserProgress, UserProgressSchema } from './user-progress.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserProgress.name, schema: UserProgressSchema }])],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
