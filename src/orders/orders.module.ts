import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductsModule } from '../products/products.module';
import { VariantsModule } from '../variants/variants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductsModule,
    VariantsModule,
  ],
  providers: [OrdersResolver, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
