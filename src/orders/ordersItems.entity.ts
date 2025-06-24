import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrdersEntity } from '../orders/orders.entity';
import { MenuEntity } from '../menu/menu.entity';
import { TechCardEntity } from "../ingridients/tech_cards.entity";

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrdersEntity, (order) => order.orderItems, { cascade: true })
  @JoinColumn({ name: 'orderId' })
  order: OrdersEntity;

  @ManyToOne(() => MenuEntity, (menu) => menu.orderItems, { cascade: true })
  @JoinColumn({ name: 'menuId' })
  menu: MenuEntity;

  @ManyToOne(() => TechCardEntity, { nullable: true })
  @JoinColumn({ name: 'techCardId' })
  techCard: TechCardEntity;

  @Column()
  quantity: number;
}
