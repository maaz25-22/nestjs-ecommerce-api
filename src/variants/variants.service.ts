import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
  ) {}

  async create(createVariantDto: CreateVariantDto): Promise<Variant> {
    const variant = this.variantRepository.create(createVariantDto);
    return this.variantRepository.save(variant);
  }

  async findAll(): Promise<Variant[]> {
    return this.variantRepository.find({
      relations: ['product'],
    });
  }

  async findOne(id: string): Promise<Variant> {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return variant;
  }

  async findByProduct(productId: string): Promise<Variant[]> {
    return this.variantRepository.find({
      where: { productId, isActive: true },
      relations: ['product'],
    });
  }

  async update(id: string, updateVariantDto: UpdateVariantDto): Promise<Variant> {
    const variant = await this.findOne(id);
    Object.assign(variant, updateVariantDto);
    return this.variantRepository.save(variant);
  }

  async remove(id: string): Promise<void> {
    const variant = await this.findOne(id);
    await this.variantRepository.remove(variant);
  }
}
