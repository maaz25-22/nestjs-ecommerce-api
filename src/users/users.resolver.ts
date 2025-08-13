import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.remove(id);
  }
}
