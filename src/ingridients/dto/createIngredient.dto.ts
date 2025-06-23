import { Column } from "typeorm";

export class CreateIngredientDto {
  name: string
  category: string
  unit: string
}