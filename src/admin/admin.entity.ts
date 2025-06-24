import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { OrdersEntity } from '../orders/orders.entity';
import { Customer } from '../customers/customer.entity';
import { EmployeesEntity } from '../employees/employees.entity';
import { MenuEntity } from '../menu/menu.entity';
import { SupplyEntity } from '../supply/supply.entity';
import { PosShiftEntity } from '../posShift/posShift.entity';
import { IngredientsEntity } from "../ingridients/ingredients.entity";
import { TechCardIngredientEntity } from "../ingridients/tech_card_ingredients.entity";

@Entity('admin')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;
  @Column()
  password: string;
  @OneToMany(() => OrdersEntity, (order) => order.admin)
  orders: OrdersEntity[];

  @OneToMany(() => Customer, (customer) => customer.admin)
  customers: Customer[];
  @OneToMany(() => EmployeesEntity, (employye) => employye.admin)
  employees: EmployeesEntity[];
  @OneToMany(() => MenuEntity, (menu) => menu.admin)
  menus: MenuEntity[];
  @OneToMany(()=>SupplyEntity, (supply) => supply.admin)
  supplys: SupplyEntity[];
  @OneToMany(()=>PosShiftEntity,(posShift) => posShift.admin)
  posShift:PosShiftEntity[];
  @OneToMany(()=>IngredientsEntity,(ingredients) => ingredients.admin)
  ingredients: IngredientsEntity[];
  @OneToMany(()=>TechCardIngredientEntity,(techCard) => techCard.admin)
  techCardIngredients: TechCardIngredientEntity[];


}
