import { DataSource } from 'typeorm';
import { Customer } from './customers/customer.entity';
import { OrdersEntity } from './orders/orders.entity';
import { AdminEntity } from './admin/admin.entity';
import { EmployeesEntity } from './employees/employees.entity';
import { OrderItemEntity } from './orders/ordersItems.entity';
import * as dotenv from 'dotenv';
import { MenuEntity } from './menu/menu.entity';
import { SupplyEntity } from './ supply/supply.entity';
import { SupplyItemEntity } from './ supply/supplyItemEntity.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'asdqwe',
  database: process.env.DB_NAME || 'cafe_management',
  synchronize: false,
  logging: true,
  entities: [Customer, OrdersEntity, AdminEntity, EmployeesEntity, OrderItemEntity,MenuEntity,SupplyEntity,SupplyItemEntity],
  migrations: ['src/migrations/*.ts'],
});
