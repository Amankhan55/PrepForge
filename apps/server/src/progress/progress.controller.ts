import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get()
  getAll(@CurrentUser() user: { userId: string }) {
    return this.progressService.getUserProgress(user.userId);
  }

  @Get('summary')
  getSummary(@CurrentUser() user: { userId: string }) {
    return this.progressService.getSummary(user.userId);
  }

  @Get('activity')
  getActivity(@CurrentUser() user: { userId: string }) {
    return this.progressService.getActivityByDate(user.userId);
  }

  @Put(':questionId')
  upsert(
    @CurrentUser() user: { userId: string },
    @Param('questionId') questionId: string,
    @Body() body: { status?: 'unseen' | 'reviewed' | 'mastered'; bookmarked?: boolean },
  ) {
    return this.progressService.upsertProgress(user.userId, questionId, body);
  }
}
