import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(name: string, email: string, passwordHash: string): Promise<UserDocument> {
    return this.userModel.create({ name, email, passwordHash });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async updateRefreshToken(userId: string, token: string | null): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: token }).exec();
  }

  async updateStreak(userId: string, streak: number, lastActiveDate: Date): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { streak, lastActiveDate }).exec();
  }
}
