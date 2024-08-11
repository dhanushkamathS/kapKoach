import { Controller, Get,Post,Body,Req, UseInterceptors, UploadedFile, HttpException, HttpStatus, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { GenerativeAIService } from 'src/generativeAI/generativeAI.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerateAnswerDto } from './dto/GenerateAnswer.dto';
import { QuestionService } from 'src/question/question.service';
import { TestService } from 'src/test/test.service';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private genai : GenerativeAIService,
    private questionService:QuestionService,
    private testService :TestService
) {}

  @Post()
  async createUser(@Body() data:CreateUserDto ): Promise<string> {
    let user = await this.userService.createUser(data.username)
    console.log(user)
    return "created"
  }

  @Post('/generate')
  @UseInterceptors(FileInterceptor('file'))
  async generate(@UploadedFile() file: Express.Multer.File,@Body() body:GenerateAnswerDto){
    let questionData = await this.questionService.fetchQuestionById(body.questionId)
    if(!questionData){
        throw new HttpException('Question not found', HttpStatus.NOT_FOUND)
    }
    console.log(questionData)
    let transcribedAudio = await this.genai.getTranscribe(file)
    
    let data = await this.genai.getCompletion(questionData.question,transcribedAudio)
    data = JSON.parse(data)
    // {
    //     "clarity": 2,
    //     "relevance": 1,
    //     "completeness": 1,
    //     "depthOfKnowledge": 1,
    //     "correctness": 5,
    //     "feedback": "The candidate failed to answer the question about a tree data structure and its usage. The response provided is unrelated to the topic, discussing a voice recorder tool and its features instead. The clarity of the response is mediocre, but the relevance, completeness, and depth of knowledge are all extremely low. The correctness is high, as the information provided about the voice recorder tool is accurate. To improve, the candidate could focus on staying on topic and providing relevant answers to the question."
    //   }
    
    let testRecord = {
        clarity:data?.clarity,
        relevance:data?.relevance,
        completeness:data?.completeness,
        depthOfKnowledge:data?.depthOfKnowledge,
        correctness:data?.correctness,
        totalScore: (data?.clarity+data?.relevance+data?.completeness+data?.depthOfKnowledge+data?.correctness),
        questionId:questionData?.questionId,
        testId:body?.testId}
    
    await this.testService.createTestRecord(testRecord)
    await this.userService.addTestIDToUser(body.userId,body.testId)

    return data
  }

  @Get('/report')
  async report(@Query('userId') userId: string){
    if(!userId){
        throw new HttpException('userId missing', HttpStatus.NOT_FOUND)
    }
    // let testRecord = {
    //     clarity:1,
    //     relevance:1,
    //     completeness:1,
    //     depthOfKnowledge:2,
    //     correctness:1,
    //     totalScore: 6,
    //     questionId:"2288c865b3",
    //     testId:"1234"}
    
    // let data = await this.testService.createTestRecord(testRecord)
    let data = await this.testService.generateTestReport(userId)

    // console.log(data)
    return data
  }
 
}
