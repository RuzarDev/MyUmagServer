import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../customers/customer.entity';
import { EmployeesEntity } from '../employees/employees.entity';
import { OrderItemEntity } from './ordersItems.entity';
import { AdminEntity } from "../admin/admin.entity";
import { PosShiftEntity } from '../posShift/posShift.entity'; // Импортируем новую сущность

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders,{onDelete:'SET NULL',nullable:true})
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({nullable:true})
  customerId: number;

  @ManyToOne(() => EmployeesEntity, (employee) => employee.orders)
  @JoinColumn({ name: 'employeeId' })
  employee: EmployeesEntity;

  @Column()
  employeeId: number;

  @Column({type: 'timestamp'})
  orderDate: Date;

  @Column()
  totalAmount: number;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];
@ManyToOne(()=>AdminEntity,admin => admin.orders)
  admin: AdminEntity;
  @ManyToOne(() => PosShiftEntity, (posShift) => posShift.orders)
  @JoinColumn({ name: 'posShiftId' }) // это создаёт колонку posShiftId
  posShift: PosShiftEntity;

  @Column({ nullable: true })
  posShiftId: number;
  @Column({ nullable: true })
  typeOfPayment: string
}
