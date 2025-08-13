import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Args('createOrderDto') createOrderDto: CreateOrderDto,
    @Context() context: any,
  ) {
    const user = context.req.user;
    return this.ordersService.create(createOrderDto, user.id);
  }

  @Query(() => [Order], { name: 'orders' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.ordersService.findAll();
  }

  @Query(() => [Order], { name: 'myOrders' })
  @UseGuards(JwtAuthGuard)
  findMyOrders(@Context() context: any) {
    const user = context.req.user;
    return this.ordersService.findByUser(user.id);
  }

  @Query(() => Order, { name: 'order' })
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateOrder(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateOrderDto') updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateOrderStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status') status: string,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeOrder(@Args('id', { type: () => ID }) id: string) {
    return this.ordersService.remove(id);
  }
}
