import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { Question } from 'src/schemas/Question.schema';
import { Test } from 'src/schemas/Test.schema';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    getHello(){
        return "helloeoeo"
    }

    createUser(username:string){
        let user:User = {
            username:username,
            userId: this.generateId(10)
        }

        let createdUser = new this.userModel(user)
        return createdUser.save()
    }

    generateId(length: number): string {
        return uuidv4()
            .replace(/-/g, '') // Remove dashes
            .replace(/[^a-zA-Z0-9]/g, '') // Ensure only alphanumeric
            .slice(0, length);
    }

    addTestIDToUser(userId:string,id:string){
       return this.userModel.findOneAndUpdate({userId:userId},
            { $addToSet: { testIds: id } },
            { new: true } // This option returns the updated document
          );
    }

    getUserById(userId:string){
        return this.userModel.findOne({userId:userId})
    }

}