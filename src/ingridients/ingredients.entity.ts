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
  @Column({default:0,type:'float'})
  stock: number;
  @Column({default:0,type:'float'})

  cost: number;

  @Column({default:0,type:'float'})

  amount: number;

  @ManyToOne(() => AdminEntity, (admin) => admin.ingredients)
  admin: AdminEntity;



}
