import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

import { Order } from '../../orders/entities/order.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Field()
  @Column({ default: 'user' })
  role: string;

  @Field()
  @Column({ default: false })
  isActive: boolean;

  @Field()
  @Column({ default: false })
  isEmailVerified: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  emailVerificationToken: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  emailVerificationExpires: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
