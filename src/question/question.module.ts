import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './question.controller';
import { QuestionService} from 'src/question/question.service';
import { Question, QuestionSchema } from 'src/schemas/Question.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Question.name,
                schema: QuestionSchema,
            },
        ])

    ],
    controllers: [QuestionController],
    providers: [QuestionService],
})
export class QuestionModule {
}