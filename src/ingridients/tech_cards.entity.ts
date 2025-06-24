import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { TechCardIngredientEntity } from "./tech_card_ingredients.entity";
import { AdminEntity } from "../admin/admin.entity";

@Entity('tech_cards')
export class TechCardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // например, "Капучино 250мл"
  @Column()
  category: string;
  @Column({default:0,type:'float'})

  cost: number
  @Column({default:0,type:'float'})
  price: number
  @OneToMany(() => TechCardIngredientEntity, tci => tci.techCard, { cascade: true })
  ingredients: TechCardIngredientEntity[];
  @ManyToOne(() => AdminEntity, (admin) => admin.techCard)
  admin: AdminEntity;
}
