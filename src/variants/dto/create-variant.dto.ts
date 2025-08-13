import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateVariantDto {
  @Field()
  @IsString()
  name: string;

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

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  attributes?: Record<string, any>;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sku?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field()
  @IsString()
  productId: string;
}
