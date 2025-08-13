import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { VariantsService } from '../variants/variants.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
    private readonly variantsService: VariantsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      userId,
      orderNumber: `ORD-${uuidv4().substring(0, 8).toUpperCase()}`,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    for (const itemDto of createOrderDto.orderItems) {
      const product = await this.productsService.findOne(itemDto.productId);
      const variant = itemDto.variantId 
        ? await this.variantsService.findOne(itemDto.variantId)
        : null;

      const unitPrice = variant ? variant.price : product.price;
      const totalPrice = unitPrice * itemDto.quantity;

      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: itemDto.productId,
        variantId: itemDto.variantId,
        quantity: itemDto.quantity,
        unitPrice,
        totalPrice,
      });

      await this.orderItemRepository.save(orderItem);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product', 'orderItems.variant'],
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product', 'orderItems.variant'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['orderItems', 'orderItems.product', 'orderItems.variant'],
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}
