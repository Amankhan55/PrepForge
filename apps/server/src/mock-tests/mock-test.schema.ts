import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MockTestDocument = MockTest & Document;

@Schema({ timestamps: true })
export class MockTest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ enum: ['angular', 'javascript', 'system-design', 'mixed'], required: true })
  category: string;

  @Prop({ enum: ['beginner', 'intermediate', 'advanced', 'mixed'], required: true })
  difficulty: string;

  @Prop({ required: true })
  durationMinutes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Question' }] })
  questions: Types.ObjectId[];

  @Prop({ type: Object, default: {} })
  answers: Record<string, string>;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 0 })
  totalQuestions: number;

  @Prop({ default: 0 })
  timeTakenSeconds: number;

  @Prop({ enum: ['in-progress', 'completed'], default: 'in-progress' })
  status: string;

  @Prop({ default: null })
  completedAt: Date | null;
}

export const MockTestSchema = SchemaFactory.createForClass(MockTest);
MockTestSchema.index({ userId: 1, createdAt: -1 });
