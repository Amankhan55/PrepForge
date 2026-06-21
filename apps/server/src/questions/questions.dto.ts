import { IsEnum, IsString, IsOptional, IsArray, IsNumber, MinLength } from 'class-validator';
import { QuestionCategory, Difficulty } from './question.schema';

export class CreateQuestionDto {
  @IsEnum(['angular', 'javascript', 'system-design'])
  category: QuestionCategory;

  @IsString()
  @MinLength(2)
  topic: string;

  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  description: string;

  @IsString()
  answer: string;

  @IsOptional()
  @IsString()
  codeSnippet?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty: Difficulty;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class QueryQuestionsDto {
  @IsOptional()
  @IsEnum(['angular', 'javascript', 'system-design'])
  category?: QuestionCategory;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty?: Difficulty;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}
