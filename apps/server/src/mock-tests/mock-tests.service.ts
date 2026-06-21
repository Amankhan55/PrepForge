import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MockTest, MockTestDocument } from './mock-test.schema';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class MockTestsService {
  constructor(
    @InjectModel(MockTest.name) private mockTestModel: Model<MockTestDocument>,
    private questionsService: QuestionsService,
  ) {}

  async startTest(
    userId: string,
    category: string,
    difficulty: string,
    durationMinutes: number,
    questionCount = 20,
  ): Promise<MockTestDocument> {
    const query: any = {};
    if (category !== 'mixed') query.category = category;
    if (difficulty !== 'mixed') query.difficulty = difficulty;

    const questions = await this.questionsService.findAll(query);
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, questionCount);

    return this.mockTestModel.create({
      userId: new Types.ObjectId(userId),
      category,
      difficulty,
      durationMinutes,
      questions: shuffled.map((q) => q._id),
      totalQuestions: shuffled.length,
    });
  }

  async submitTest(
    userId: string,
    testId: string,
    answers: Record<string, string>,
    timeTakenSeconds: number,
  ): Promise<MockTestDocument> {
    const test = await this.mockTestModel.findOne({
      _id: testId,
      userId: new Types.ObjectId(userId),
    }).populate('questions').exec();
    if (!test) throw new NotFoundException('Test not found');

    // Simple scoring: count correct answers (for MCQ; full impl per question type)
    const score = Object.keys(answers).length;

    return this.mockTestModel.findByIdAndUpdate(
      testId,
      {
        answers,
        score,
        timeTakenSeconds,
        status: 'completed',
        completedAt: new Date(),
      },
      { new: true },
    ).exec();
  }

  findHistory(userId: string): Promise<MockTestDocument[]> {
    return this.mockTestModel
      .find({ userId: new Types.ObjectId(userId), status: 'completed' })
      .sort({ completedAt: -1 })
      .exec();
  }

  async getScoreTrend(userId: string) {
    const tests = await this.findHistory(userId);
    return tests.map((t) => ({
      date: t.completedAt,
      score: t.score,
      total: t.totalQuestions,
      percentage: t.totalQuestions > 0 ? Math.round((t.score / t.totalQuestions) * 100) : 0,
      category: t.category,
    }));
  }
}
