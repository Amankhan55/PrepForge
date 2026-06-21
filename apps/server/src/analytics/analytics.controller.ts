import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('summary')
  summary(@CurrentUser() user: { userId: string }) {
    return this.analyticsService.getSummary(user.userId);
  }

  @Get('heatmap')
  heatmap(@CurrentUser() user: { userId: string }) {
    return this.analyticsService.getHeatmap(user.userId);
  }

  @Get('radar')
  radar(@CurrentUser() user: { userId: string }) {
    return this.analyticsService.getTopicRadar(user.userId);
  }
}
