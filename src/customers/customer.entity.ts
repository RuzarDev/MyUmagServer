import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { OrdersEntity } from '../orders/orders.entity';
import { AdminEntity } from '../admin/admin.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  Customerphone: string;

  @OneToMany(() => OrdersEntity, (order) => order.customer)
  orders: OrdersEntity[];

  @ManyToOne(() => AdminEntity, (admin) => admin.customers)
  admin: AdminEntity;
}
