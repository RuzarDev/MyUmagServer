import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from '../menu/menu.entity';
import { OrdersEntity } from './orders.entity';
import { EmployeesEntity } from '../employees/employees.entity';
import { EmployeesModule } from '../employees/employees.module';
import { CustomersModule } from '../customers/customers.module';
import { Customer } from '../customers/customer.entity';
import { MenuModule } from '../menu/menu.module';
import { OrderItemEntity } from "./ordersItems.entity";
import { AuthModule } from "../auth/auth.module";
import { PosShiftEntity } from '../posShift/posShift.entity';
import { PosShiftModule } from '../posShift/posShift.module';
import { IngredientsModule } from "../ingridients/ingredients.module";
import { IngredientsEntity } from "../ingridients/ingredients.entity";
import { TechCardIngredientEntity } from "../ingridients/tech_card_ingredients.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersEntity,
      EmployeesEntity,
      Customer,
      MenuEntity,
      OrderItemEntity,
      OrderItemEntity,
      PosShiftEntity,
      IngredientsEntity,
      TechCardIngredientEntity
    ]),
    EmployeesModule,
    CustomersModule,
    MenuModule,
    AuthModule,
    PosShiftModule,
    IngredientsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
