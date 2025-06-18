import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Customer} from "./customer.entity";
import {CustomersService} from "./customers.service";
import {CustomersController} from "./customers.controller";
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";
import {AdminModule} from "../admin/admin.module";

@Module({
    imports:[TypeOrmModule.forFeature([Customer]),AuthModule],
    providers:[CustomersService],
    controllers:[CustomersController],
})
export class CustomersModule {

}
