import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MockTestsController } from './mock-tests.controller';
import { MockTestsService } from './mock-tests.service';
import { MockTest, MockTestSchema } from './mock-test.schema';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MockTest.name, schema: MockTestSchema }]),
    QuestionsModule,
  ],
  controllers: [MockTestsController],
  providers: [MockTestsService],
  exports: [MockTestsService],
})
export class MockTestsModule {}
