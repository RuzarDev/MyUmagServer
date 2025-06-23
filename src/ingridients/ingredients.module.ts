import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsEntity } from './ingredients.entity';
import { TechCardIngredientEntity } from "./tech_card_ingredients.entity";
import { TechCardEntity } from "./tech_cards.entity";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([IngredientsEntity,TechCardIngredientEntity,TechCardEntity]),AuthModule],
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
