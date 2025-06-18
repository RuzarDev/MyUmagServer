import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrdersEntity } from '../orders/orders.entity';
import { AdminEntity } from '../admin/admin.entity';

@Entity('posShift')
export class PosShiftEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  openedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date | null;

  @Column({ default: true })
  isOpen: boolean;

  @Column({ default: 0 })
  card: number;

  @Column({ default: 0 })
  cash: number;
  @Column({ default: 0 })
  openedCashDrawer: number;

  @Column({ default: 0 })
  closedCashDrawer: number;
  @Column({ default: 0 })
  cashPool: number;

  @OneToMany(() => OrdersEntity, (order) => order.posShift)
  orders: OrdersEntity[];
  @ManyToOne(()=>AdminEntity, (admin) => admin.posShift)
  admin: AdminEntity;
}
