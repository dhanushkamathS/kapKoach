import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GenerateAnswerDto {

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    questionId: string;

    @IsNotEmpty()
    @IsString()
    testId: string;

}