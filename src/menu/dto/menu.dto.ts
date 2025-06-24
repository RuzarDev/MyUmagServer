import { IsNumber, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class IngredientInputDto {
  @IsNumber()
  ingredientId: number;

  @IsNumber()
  quantity: number;
}

export class MenuDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  price: number;
  @IsNumber()
  cost: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientInputDto)
  ingredients?: IngredientInputDto[];
}
