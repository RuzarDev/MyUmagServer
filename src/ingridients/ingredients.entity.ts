import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AdminEntity } from "../admin/admin.entity";

@Entity('Ingredients')
export class IngredientsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @Column()
  category: string
  @Column()
  unit: string
  @Column({default:0})
  stock: number;
  @Column({default: 0})
  cost: number;

  @Column({default: 0})
  amount: number;

  @ManyToOne(() => AdminEntity, (admin) => admin.ingredients)
  admin: AdminEntity;



}
