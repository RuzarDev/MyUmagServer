import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { OrdersEntity } from '../orders/orders.entity';
import { AdminEntity } from '../admin/admin.entity';

@Entity('employees')
export class EmployeesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => OrdersEntity, (order) => order.employee) m
  orders: OrdersEntity[];
  @ManyToOne(() => AdminEntity, (admin) => admin.employees)
  admin: AdminEntity;
}
