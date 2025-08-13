import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateOrderItemDto {
  @Field()
  @IsString()
  productId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  variantId?: string;

  @Field()
  @IsNumber()
  quantity: number;
}

@InputType()
export class CreateOrderDto {
  @Field()
  @IsNumber()
  totalAmount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @Field()
  @IsNumber()
  finalAmount: number;

  @Field(() => GraphQLJSON)
  shippingAddress: Record<string, any>;

  @Field(() => GraphQLJSON)
  billingAddress: Record<string, any>;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => [CreateOrderItemDto])
  @IsArray()
  orderItems: CreateOrderItemDto[];
}
