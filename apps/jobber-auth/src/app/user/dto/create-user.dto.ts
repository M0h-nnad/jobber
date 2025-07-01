import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;
}
