import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MenuEntity} from "./menu.entity";
import { AuthModule } from "../auth/auth.module";
import { IngredientsEntity } from "../ingridients/ingredients.entity";
import { TechCardIngredientEntity } from "../ingridients/tech_card_ingredients.entity";
import { TechCardEntity } from "../ingridients/tech_cards.entity";

@Module({
  imports:[TypeOrmModule.forFeature([MenuEntity,IngredientsEntity,TechCardIngredientEntity,TechCardEntity]),AuthModule],
  providers: [MenuService],
  controllers: [MenuController],
  exports:[TypeOrmModule]
})
export class MenuModule {}
