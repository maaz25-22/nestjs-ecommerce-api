import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createProduct(@Args('createProductDto') createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Query(() => [Product], { name: 'products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Query(() => [Product], { name: 'featuredProducts' })
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Query(() => [Product], { name: 'productsByCategory' })
  findByCategory(@Args('categoryId', { type: () => ID }) categoryId: string) {
    return this.productsService.findByCategory(categoryId);
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.findOne(id);
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateProductDto') updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Mutation(() => Product)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeProduct(@Args('id', { type: () => ID }) id: string) {
    return this.productsService.remove(id);
  }
}
