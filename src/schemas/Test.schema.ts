import { Document, Mongoose } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Test {
  @Prop()
  testId: string;

  @Prop()
  questionId: string;

  @Prop()
  clarity: number;

  @Prop()
  relevance: number;

  @Prop()
  completeness: number;

  @Prop()
  depthOfKnowledge: number;

  @Prop()
  correctness: number;

  @Prop()
  totalScore: number;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;
}

export const TestSchema = SchemaFactory.createForClass(Test);