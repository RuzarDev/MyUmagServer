import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IngredientsEntity } from './ingredients.entity';
import { TechCardEntity } from "./tech_cards.entity";
import { AdminEntity } from "../admin/admin.entity";

@Entity('tech_card_ingredients')
export class TechCardIngredientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TechCardEntity, techCard => techCard.ingredients)
  techCard: TechCardEntity;

  @ManyToOne(() => IngredientsEntity)
  ingredient: IngredientsEntity;

  @Column()
  amount: number;

  @ManyToOne(() => AdminEntity, (admin) => admin.techCardIngredients)
  admin: AdminEntity;
}
