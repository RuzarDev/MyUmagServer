import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplyEntity } from './supply.entity';
import { AuthModule } from '../auth/auth.module';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { SupplyItemEntity } from './supplyItemEntity.entity';
import { MenuModule } from '../menu/menu.module';

@Module({
  imports: [TypeOrmModule.forFeature([SupplyEntity,SupplyItemEntity]),AuthModule,MenuModule],
  controllers: [SupplyController],
  providers: [SupplyService],


})
export class SupplyModule {}