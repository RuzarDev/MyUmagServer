import { TechCardIngredientDto } from "./techCardIngredient.dto";

export class UpdateTechCardDto {
  id: number;
  name: string;
  category: string;
  ingredients: TechCardIngredientDto[];
}
