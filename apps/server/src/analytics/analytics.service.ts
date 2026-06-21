import { Injectable } from '@nestjs/common';
import { ProgressService } from '../progress/progress.service';
import { MockTestsService } from '../mock-tests/mock-tests.service';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { UserProgress } from '../progress/user-progress.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class AnalyticsService {
  constructor(
    private progressService: ProgressService,
    private mockTestsService: MockTestsService,
    private usersService: UsersService,
    @InjectModel(UserProgress.name) private progressModel: Model<any>,
  ) {}

  async getSummary(userId: string) {
    const [progressSummary, scoreTrend, user] = await Promise.all([
      this.progressService.getSummary(userId),
      this.mockTestsService.getScoreTrend(userId),
      this.usersService.findById(userId),
    ]);

    const avgScore = scoreTrend.length
      ? Math.round(scoreTrend.reduce((a, t) => a + t.percentage, 0) / scoreTrend.length)
      : 0;

    return {
      ...progressSummary,
      streak: user?.streak ?? 0,
      testsCompleted: scoreTrend.length,
      avgScore,
    };
  }

  async getHeatmap(userId: string) {
    return this.progressService.getActivityByDate(userId);
  }

  async getTopicRadar(userId: string) {
    const results = await this.progressModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId), status: { $in: ['reviewed', 'mastered'] } } },
      {
        $lookup: {
          from: 'questions',
          localField: 'questionId',
          foreignField: '_id',
          as: 'question',
        },
      },
      { $unwind: '$question' },
      {
        $group: {
          _id: { topic: '$question.topic', category: '$question.category' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    return results;
  }
}
