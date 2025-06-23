import { Controller, Post, Req } from "@nestjs/common";
import { IngredientsService } from "./ingredients.service";
import { Request } from "express";
import { CreateIngredientDto } from "./dto/createIngredient.dto";

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}
  @Post()
  createIngredient(@Req() req: Request,dto: CreateIngredientDto){
  return this.ingredientsService.createIngredient(req,dto)
}
}
