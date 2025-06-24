import { Column } from "typeorm";
import { TechCardIngredientEntity } from "../tech_card_ingredients.entity";
export class ingredientsDto {
  ingredientId: number
  quantity: number
}

export class CreateTechCardDto {
  name: string
  category: string
  price: number
  ingredients: ingredientsDto[]

}