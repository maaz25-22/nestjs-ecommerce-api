import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

import { Variant } from '../../variants/entities/variant.entity';
import { Category } from '../../categories/entities/category.entity';

@ObjectType()
@Entity('products')
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountPrice: number;

  @Field()
  @Column({ default: 0 })
  stock: number;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ default: false })
  isFeatured: boolean;

  @Field()
  @Column({ default: 0 })
  rating: number;

  @Field()
  @Column({ default: 0 })
  reviewCount: number;

  @Field(() => [String])
  @Column('simple-array', { nullable: true })
  images: string[];

  @Field(() => GraphQLJSON)
  @Column('simple-json', { nullable: true })
  specifications: Record<string, any>;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Variant], { nullable: true })
  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Field()
  @Column({ nullable: true })
  categoryId: string;
}
