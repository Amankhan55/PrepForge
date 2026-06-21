import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

export type QuestionCategory = 'angular' | 'javascript' | 'system-design';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true, enum: ['angular', 'javascript', 'system-design'] })
  category: QuestionCategory;

  @Prop({ required: true, trim: true })
  topic: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ default: '' })
  codeSnippet: string;

  @Prop({ required: true, enum: ['beginner', 'intermediate', 'advanced'] })
  difficulty: Difficulty;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0 })
  order: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
QuestionSchema.index({ category: 1, difficulty: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ title: 'text', description: 'text' });
