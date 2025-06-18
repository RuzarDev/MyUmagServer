// supplyItemEntity.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MenuEntity } from '../menu/menu.entity';
import { SupplyEntity } from './supply.entity';

@Entity()
export class SupplyItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SupplyEntity, (supply) => supply.items)
  supply: SupplyEntity;

  @ManyToOne(() => MenuEntity)
  menuItem: MenuEntity;

  @Column()
  quantity: number;

  @Column('float') // или 'decimal'
  price: number;
}
