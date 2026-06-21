import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './question.schema';
import { CreateQuestionDto, QueryQuestionsDto } from './questions.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async findAll(query: QueryQuestionsDto): Promise<QuestionDocument[]> {
    const filter: Record<string, any> = {};

    if (query.category) filter.category = query.category;
    if (query.topic) filter.topic = new RegExp(query.topic, 'i');
    if (query.difficulty) filter.difficulty = query.difficulty;
    if (query.tag) filter.tags = query.tag;
    if (query.search) {
      filter.$text = { $search: query.search };
    }

    return this.questionModel.find(filter).sort({ order: 1, createdAt: 1 }).exec();
  }

  async findById(id: string): Promise<QuestionDocument> {
    const q = await this.questionModel.findById(id).exec();
    if (!q) throw new NotFoundException(`Question ${id} not found`);
    return q;
  }

  async create(dto: CreateQuestionDto): Promise<QuestionDocument> {
    return this.questionModel.create(dto);
  }

  async update(id: string, dto: Partial<CreateQuestionDto>): Promise<QuestionDocument> {
    const q = await this.questionModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!q) throw new NotFoundException(`Question ${id} not found`);
    return q;
  }

  async delete(id: string): Promise<void> {
    await this.questionModel.findByIdAndDelete(id).exec();
  }

  async getTopics(category?: string): Promise<string[]> {
    const filter: Record<string, any> = category ? { category } : {};
    return this.questionModel.distinct('topic', filter).exec() as unknown as Promise<string[]>;
  }

  async bulkCreate(questions: CreateQuestionDto[]): Promise<void> {
    await this.questionModel.insertMany(questions);
  }
}
