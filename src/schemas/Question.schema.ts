import { Document, Mongoose } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Question {

  @Prop()
  courseId: string;

  @Prop()
  courseName: string;

  @Prop()
  questionId: string;

  @Prop()
  question: string;

  @Prop()
  videoLink?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt?: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);