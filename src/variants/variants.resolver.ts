import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { Variant } from './entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => Variant)
export class VariantsResolver {
  constructor(private readonly variantsService: VariantsService) {}

  @Mutation(() => Variant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createVariant(@Args('createVariantDto') createVariantDto: CreateVariantDto) {
    return this.variantsService.create(createVariantDto);
  }

  @Query(() => [Variant], { name: 'variants' })
  findAll() {
    return this.variantsService.findAll();
  }

  @Query(() => [Variant], { name: 'variantsByProduct' })
  findByProduct(@Args('productId', { type: () => ID }) productId: string) {
    return this.variantsService.findByProduct(productId);
  }

  @Query(() => Variant, { name: 'variant' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.variantsService.findOne(id);
  }

  @Mutation(() => Variant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateVariant(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateVariantDto') updateVariantDto: UpdateVariantDto,
  ) {
    return this.variantsService.update(id, updateVariantDto);
  }

  @Mutation(() => Variant)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeVariant(@Args('id', { type: () => ID }) id: string) {
    return this.variantsService.remove(id);
  }
}
