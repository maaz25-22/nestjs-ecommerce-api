import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantsService } from './variants.service';
import { VariantsResolver } from './variants.resolver';
import { Variant } from './entities/variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variant])],
  providers: [VariantsResolver, VariantsService],
  exports: [VariantsService],
})
export class VariantsModule {}
