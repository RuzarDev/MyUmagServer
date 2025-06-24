import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { OrderItemEntity } from '../orders/ordersItems.entity';
import { AdminEntity } from '../admin/admin.entity';
import { SupplyItemEntity } from '../supply/supplyItemEntity.entity';
import { TechCardIngredientEntity } from "../ingridients/tech_card_ingredients.entity";

@Entity('menu')
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column('float', { nullable: true }) // Разрешаем null для этого поля
  cost: number | null; // Указываем, что это поле может быть числом или null

  @Column()
  category: string;

  @Column({ default: 0 })
  stock: number;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.menu)
  orderItems: OrderItemEntity[];

  @ManyToOne(() => AdminEntity, (admin) => admin.employees)
  admin: AdminEntity;
  @OneToMany(() => TechCardIngredientEntity, tci => tci.menu, { cascade: true,nullable:true })
  ingredients: TechCardIngredientEntity[];

  @OneToMany(() => SupplyItemEntity, (item) => item.menuItem)
  supply: SupplyItemEntity[];
}