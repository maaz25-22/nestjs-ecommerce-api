import { InputType, PartialType } from '@nestjs/graphql';
import { CreateVariantDto } from './create-variant.dto';

@InputType()
export class UpdateVariantDto extends PartialType(CreateVariantDto) {}
