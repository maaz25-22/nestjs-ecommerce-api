import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createCategory(@Args('createCategoryDto') createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCategoryDto') updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Mutation(() => Category)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoriesService.remove(id);
  }
}
