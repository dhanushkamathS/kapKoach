import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    username: string;
}