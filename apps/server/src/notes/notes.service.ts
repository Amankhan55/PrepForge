import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from './note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  findAll(userId: string, search?: string): Promise<NoteDocument[]> {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (search) filter.$text = { $search: search };
    return this.noteModel.find(filter).sort({ updatedAt: -1 }).exec();
  }

  async findOne(userId: string, id: string): Promise<NoteDocument> {
    const note = await this.noteModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  create(userId: string, title: string, content: string, questionId?: string): Promise<NoteDocument> {
    return this.noteModel.create({
      userId: new Types.ObjectId(userId),
      title,
      content,
      questionId: questionId ? new Types.ObjectId(questionId) : null,
    });
  }

  async update(userId: string, id: string, title?: string, content?: string): Promise<NoteDocument> {
    const note = await this.noteModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) },
      { ...(title && { title }), ...(content !== undefined && { content }) },
      { new: true },
    ).exec();
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.noteModel.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) }).exec();
  }
}
