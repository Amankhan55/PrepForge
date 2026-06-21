import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserProgress, UserProgressDocument } from './user-progress.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(UserProgress.name) private progressModel: Model<UserProgressDocument>,
  ) {}

  async getUserProgress(userId: string): Promise<UserProgressDocument[]> {
    return this.progressModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async upsertProgress(
    userId: string,
    questionId: string,
    update: { status?: 'unseen' | 'reviewed' | 'mastered'; bookmarked?: boolean },
  ): Promise<UserProgressDocument> {
    return this.progressModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        questionId: new Types.ObjectId(questionId),
      },
      { ...update, lastSeenAt: new Date() },
      { upsert: true, new: true },
    ).exec();
  }

  async getSummary(userId: string) {
    const all = await this.getUserProgress(userId);
    return {
      total: all.length,
      reviewed: all.filter((p) => p.status === 'reviewed').length,
      mastered: all.filter((p) => p.status === 'mastered').length,
      bookmarked: all.filter((p) => p.bookmarked).length,
    };
  }

  async getActivityByDate(userId: string): Promise<Record<string, number>> {
    const results = await this.progressModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId), lastSeenAt: { $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastSeenAt' } },
          count: { $sum: 1 },
        },
      },
    ]);
    return results.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), {});
  }
}
