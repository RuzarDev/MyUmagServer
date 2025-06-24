import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { AdminEntity } from "../admin/admin.entity";
import { MenuEntity } from "../menu/menu.entity";
import { IngredientsEntity } from "./ingredients.entity";

@Entity('tech_card_ingredients')
export class TechCardIngredientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MenuEntity, menu => menu.ingredients, {
    nullable: true, // Позволяет иметь TechCardIngredient без привязки к Menu
    onDelete: 'SET NULL', // Не удаляет ингредиенты при удалении меню, а просто обнуляет ссылку
  })
  @JoinColumn({ name: 'menuId' })
  menu: MenuEntity;

  @ManyToOne(() => IngredientsEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredientId' })
  ingredient: IngredientsEntity;

  @Column({default:0,type:'float'})

  amount: number;

  @ManyToOne(() => AdminEntity, (admin) => admin.techCardIngredients)
  admin: AdminEntity;
}
