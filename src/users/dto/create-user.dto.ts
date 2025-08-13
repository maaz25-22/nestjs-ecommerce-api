import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(2)
  firstName: string;

  @Field()
  @IsString()
  @MinLength(2)
  lastName: string;

  @Field()
  @IsString()
  @MinLength(3)
  username: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  role?: string;
}
