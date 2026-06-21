import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ProgressModule } from '../progress/progress.module';
import { MockTestsModule } from '../mock-tests/mock-tests.module';
import { UsersModule } from '../users/users.module';
import { UserProgress, UserProgressSchema } from '../progress/user-progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserProgress.name, schema: UserProgressSchema }]),
    ProgressModule,
    MockTestsModule,
    UsersModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
