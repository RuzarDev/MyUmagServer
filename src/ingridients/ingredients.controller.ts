import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  Req, Query
} from "@nestjs/common";
import { Request } from 'express';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/createIngredient.dto';
import { UpdateIngredientDto } from './dto/updateIngredient.dto';
import { CreateTechCardDto } from './dto/createTechCard.dto';
import { UpdateTechCardDto } from './dto/updateTechCard.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  createIngredient(@Req() req: Request, @Body() dto: CreateIngredientDto) {
    return this.ingredientsService.createIngredient(req, dto);
  }

  @Put()
  updateIngredient(@Req() req: Request, @Body() dto: UpdateIngredientDto) {
    return this.ingredientsService.updateIngredient(req, dto);
  }

  @Get()
  getAll(@Req() req: Request) {
    return this.ingredientsService.getIngredients(req);
  }





}
