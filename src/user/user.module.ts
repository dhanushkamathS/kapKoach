import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UserController  } from './user.controller';
import { UserService} from 'src/user/user.service';
import { User,UserSchema } from 'src/schemas/User.schema';
import { Question,QuestionSchema } from 'src/schemas/Question.schema';
import { Test,TestSchema } from 'src/schemas/Test.schema';
import { GenerativeAIService } from 'src/generativeAI/generativeAI.service';
import { HttpModule } from '@nestjs/axios';
import { QuestionService } from 'src/question/question.service';
import { TestService } from 'src/test/test.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
            {
                name: Question.name,
                schema: QuestionSchema,
            },
            {
                name: Test.name,
                schema: TestSchema,
            },

        ]),
        HttpModule

    ],
    controllers: [UserController],
    providers: [UserService,GenerativeAIService,QuestionService,TestService],
})
export class UserModule {
}