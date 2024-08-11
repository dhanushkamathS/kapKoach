import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateQuestionDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    contact: string;

    @IsOptional()
    couponCode?: string;

    @IsNotEmpty()
    @IsString()
    productId: string;
}