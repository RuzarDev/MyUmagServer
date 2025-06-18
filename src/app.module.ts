import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { EmployeesModule } from './employees/employees.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { SupplyModule } from './ supply/supply.module';
import { PosShiftModule } from './posShift/posShift.module';
import * as dotenv from 'dotenv';
import * as process from 'node:process';
dotenv.config()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      autoLoadEntities: true,
    }),
    CustomersModule,
    EmployeesModule,
    MenuModule,
    OrdersModule,
    AuthModule,
    AdminModule,
    SupplyModule,
    PosShiftModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
