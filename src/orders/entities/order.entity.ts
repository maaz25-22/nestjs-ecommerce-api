import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@ObjectType()
@Entity('orders')
export class Order {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  orderNumber: string;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  finalAmount: number;

  @Field()
  @Column({ default: 'pending' })
  status: string;

  @Field(() => GraphQLJSON)
  @Column('simple-json')
  shippingAddress: Record<string, any>;

  @Field(() => GraphQLJSON)
  @Column('simple-json')
  billingAddress: Record<string, any>;

  @Field()
  @Column({ nullable: true })
  notes: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Field()
  @Column()
  userId: string;

  @Field(() => [OrderItem], { nullable: true })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
