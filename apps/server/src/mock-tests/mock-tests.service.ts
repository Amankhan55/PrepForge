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

    // Grade each descriptive answer using keyword-matching heuristics
    let score = 0;
    const questionsList = (test.questions || []) as any[];
    
    for (const q of questionsList) {
      const userAnswer = answers[q._id.toString()];
      if (userAnswer && this.gradeAnswer(userAnswer, q.answer, q.tags || [])) {
        score++;
      }
    }

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
    ).populate('questions').exec();
  }

  private gradeAnswer(userAnswer: string, correctAnswer: string, tags: string[]): boolean {
    if (!userAnswer || userAnswer.trim().length < 5) return false;

    const cleanUser = userAnswer.toLowerCase();
    
    // 1. Check for matches against the question tags (case-insensitive)
    const matchedTags = tags.filter(tag => cleanUser.includes(tag.toLowerCase()));
    
    // 2. Extract significant keywords from the correct answer (length > 4, omitting common stop words)
    const stopWords = new Set([
      'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
      'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
      'can', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
      'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'him', 'his', 'how', 'if', 'in',
      'into', 'is', 'it', 'its', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off',
      'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
      'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
      'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
      'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why',
      'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
    ]);
    
    const correctWords = correctAnswer
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4 && !stopWords.has(w));
      
    const uniqueKeywords = Array.from(new Set(correctWords));
    
    // 3. Count matching keywords in the user's answer
    const matchedKeywords = uniqueKeywords.filter(kw => cleanUser.includes(kw));
    
    const tagMatchCount = matchedTags.length;
    const keywordMatchCount = matchedKeywords.length;
    const keywordMatchRatio = uniqueKeywords.length > 0 ? keywordMatchCount / uniqueKeywords.length : 0;
    
    // Heuristics:
    // - At least 1 tag matched AND at least 2 significant keywords matched
    // - OR, at least 4 significant keywords matched
    // - OR, at least 25% of the unique keywords matched (minimum of 2)
    if (tagMatchCount >= 1 && keywordMatchCount >= 2) return true;
    if (keywordMatchCount >= 4) return true;
    if (keywordMatchRatio >= 0.25 && keywordMatchCount >= 2) return true;
    
    return false;
  }

  async findOne(userId: string, testId: string): Promise<MockTestDocument> {
    const test = await this.mockTestModel.findOne({
      _id: testId,
      userId: new Types.ObjectId(userId),
    }).populate('questions').exec();
    if (!test) throw new NotFoundException('Test session not found');
    return test;
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
