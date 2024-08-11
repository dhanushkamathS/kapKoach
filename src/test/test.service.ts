import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test} from 'src/schemas/Test.schema';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import {UserService} from "../user/user.service"

interface CreateTest {
    testId: string;
    questionId: string;
    clarity: number;
    relevance: number;
    completeness: number;
    depthOfKnowledge: number;
    totalScore:number;
    correctness: number;
  }

@Injectable()
export class TestService {
    constructor(@InjectModel(Test.name) private testModel: Model<Test>,private userService : UserService) { }
 
   createTestRecord(data:CreateTest){
     return this.testModel.findOneAndUpdate(
        {testId:data.testId, questionId : data.questionId},
        { $set: data },
        { 
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
        }
    )
    }

    async generateTestReport(userId:string){
        let user = await this.userService.getUserById(userId)
        console.log(user.testIds)
        let data = this.testModel.aggregate([
            // Match documents with the given testIds
            { $match: { testId: { $in: user.testIds } } },
            
            // Group by testId and sum the clarity values
            {
              $group: {
                _id: "$testId",
                totalScoreSum: { $sum: "$totalScore" },
                questionCount: { $sum: 1 },
                date: { $first: "$createdAt" }
              }
            },
            
            // Reshape the output
            {
              $project: {
                _id: 0,
                testId: "$_id",
                totalScoreSum: 1,
                questionCount: 1,
                date:1,
                totalScorePercentage: {
                    $multiply: [
                      { $divide: ["$totalScoreSum", { $multiply: ["$questionCount", 25] }] },
                      100
                    ]
                  }
              }
            },
            
            // Sort by testId for consistency
            { $sort: { testId: 1 } }
          ]);
          

        return data
    }

}