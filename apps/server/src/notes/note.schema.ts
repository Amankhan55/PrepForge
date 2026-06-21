import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Question', default: null })
  questionId: Types.ObjectId | null;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ title: 'text', content: 'text' });
