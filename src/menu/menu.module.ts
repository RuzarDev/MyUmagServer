import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MenuEntity} from "./menu.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports:[TypeOrmModule.forFeature([MenuEntity]),AuthModule],
  providers: [MenuService],
  controllers: [MenuController],
  exports:[TypeOrmModule]
})
export class MenuModule {}
