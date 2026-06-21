import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserProgressDocument = UserProgress & Document;

@Schema({ timestamps: true })
export class UserProgress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  @Prop({ enum: ['unseen', 'reviewed', 'mastered'], default: 'unseen' })
  status: 'unseen' | 'reviewed' | 'mastered';

  @Prop({ default: false })
  bookmarked: boolean;

  @Prop({ default: null })
  lastSeenAt: Date | null;
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress);
UserProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
