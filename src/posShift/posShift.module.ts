import { Module } from '@nestjs/common';
import {PosShiftService} from './posShift.service'
import {PosShiftController} from './posShift.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from '../orders/orders.entity';
import { PosShiftEntity } from './posShift.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      OrdersEntity,
      PosShiftEntity
    ]),
    AuthModule,
    PosShiftModule,
  ],
  controllers:[PosShiftController],
  providers:[PosShiftService],
  exports: [PosShiftService,PosShiftModule]
})
export class PosShiftModule {

}