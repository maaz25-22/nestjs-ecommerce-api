import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateProductDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsNumber()
  price: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  images?: string[];

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  specifications?: Record<string, any>;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
