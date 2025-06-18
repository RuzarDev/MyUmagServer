import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MenuEntity } from '../menu/menu.entity';
import { SupplyItemEntity } from './supplyItemEntity.entity';
import { AdminEntity } from '../admin/admin.entity';

@Entity('supply')
export class SupplyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  supplier: string;

  @Column()
  amount: number;

  @OneToMany(() => MenuEntity, menu => menu.supply)
  menuItems: MenuEntity[]; // must be an array
  @OneToMany(() => SupplyItemEntity, item => item.supply, { cascade: true })
  items: SupplyItemEntity[];
  @ManyToOne(()=>AdminEntity, (admin) => admin.supplys)
  admin: AdminEntity;
}
