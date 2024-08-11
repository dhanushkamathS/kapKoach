import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from 'src/schemas/Question.schema';
import { CreateQuestionDto} from './dto/CreateQuestion.dto'
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';



@Injectable()
export class QuestionService {
    constructor(@InjectModel(Question.name) private questionModel: Model<Question>) { }

    getHello(){
        return "helloeoeo"
    }

    createQuestion(){
        try {
            let question: Question = {
                questionId: this.generateQuestionId(10),
                courseId : "e5379b3640",
                courseName:"GRE",
                question : "what is a dangeling verb"
            }
            const createdQuestion = new this.questionModel(question)
            return createdQuestion.save()
        } catch (error) {
            console.log(error)
            return null
        }
    }

    generateQuestionId(length: number): string {
        return uuidv4()
            .replace(/-/g, '') // Remove dashes
            .replace(/[^a-zA-Z0-9]/g, '') // Ensure only alphanumeric
            .slice(0, length);
    }

    fetchQuestionById(id:string){
        return this.questionModel.findOne({questionId:id})
    }

    fetchCourseById(id:string){
        return this.questionModel.aggregate([
            // Match documents with the given courseIds
            { $match: { courseId: id  } },
            
            // Group by courseId and courseName
            {
              $group: {
                _id: { courseId: "$courseId", courseName: "$courseName" },
                questions: {
                  $push: {
                    questionId: "$questionId",
                    question: "$question",
                    videoLink: "$videoLink"
                  }
                }
              }
            },
            
            // Reshape the output
            {
              $project: {
                _id: 0,
                courseId: "$_id.courseId",
                courseName: "$_id.courseName",
                questions: 1
              }
            }
          ]);
    }

}