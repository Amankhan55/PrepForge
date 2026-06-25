import { Controller, Post, Put, Get, Body, Param, UseGuards } from '@nestjs/common';
import { MockTestsService } from './mock-tests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('mock-tests')
@UseGuards(JwtAuthGuard)
export class MockTestsController {
  constructor(private mockTestsService: MockTestsService) {}

  @Post('start')
  start(
    @CurrentUser() user: { userId: string },
    @Body() body: { category: string; difficulty: string; durationMinutes: number; questionCount?: number },
  ) {
    return this.mockTestsService.startTest(
      user.userId,
      body.category,
      body.difficulty,
      body.durationMinutes,
      body.questionCount,
    );
  }

  @Put(':id/submit')
  submit(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() body: { answers: Record<string, string>; timeTakenSeconds: number },
  ) {
    return this.mockTestsService.submitTest(user.userId, id, body.answers, body.timeTakenSeconds);
  }

  @Get('history')
  history(@CurrentUser() user: { userId: string }) {
    return this.mockTestsService.findHistory(user.userId);
  }

  @Get('score-trend')
  scoreTrend(@CurrentUser() user: { userId: string }) {
    return this.mockTestsService.getScoreTrend(user.userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    return this.mockTestsService.findOne(user.userId, id);
  }
}
