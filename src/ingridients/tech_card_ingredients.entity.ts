import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TechCardEntity } from "./tech_cards.entity";
import { AdminEntity } from "../admin/admin.entity";
import { MenuEntity } from "../menu/menu.entity";

@Entity('tech_card_ingredients')
export class TechCardIngredientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TechCardEntity, techCard => techCard.ingredients)
  techCard: TechCardEntity;

  @ManyToOne(() => MenuEntity)
  ingredient: MenuEntity;

  @Column({default:0,type:'float'})

  amount: number;

  @ManyToOne(() => AdminEntity, (admin) => admin.techCardIngredients)
  admin: AdminEntity;
}
