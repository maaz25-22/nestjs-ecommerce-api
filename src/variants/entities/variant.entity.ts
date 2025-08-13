import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity('variants')
export class Variant {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountPrice: number;

  @Field()
  @Column({ default: 0 })
  stock: number;

  @Field(() => GraphQLJSON)
  @Column('simple-json', { nullable: true })
  attributes: Record<string, any>;

  @Field()
  @Column({ nullable: true })
  sku: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @Field()
  @Column()
  productId: string;
}
