import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { Variant } from '../../variants/entities/variant.entity';

@ObjectType()
@Entity('order_items')
export class OrderItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  quantity: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @Field()
  @Column()
  orderId: string;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;

  @Field()
  @Column()
  productId: string;

  @Field(() => Variant, { nullable: true })
  @ManyToOne(() => Variant)
  variant: Variant;

  @Field({ nullable: true })
  @Column({ nullable: true })
  variantId: string;
}
