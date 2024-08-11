import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('api')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get("/create")
  async getHello(): Promise<string> {
    let val = await this.questionService.createQuestion()
    console.log(val)
    return "created"
  }

  @Get("/course")
  async getCourse(@Query('courseId') courseId: string): Promise<any> {
    if(!courseId){
        throw new HttpException('courseId missing', HttpStatus.NOT_FOUND)
    }

    let val = await this.questionService.fetchCourseById(courseId)

    return val
  }

}
