import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {EmployeesEntity} from "./employees.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports:[TypeOrmModule.forFeature([EmployeesEntity]),AuthModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],

})
export class EmployeesModule {}
