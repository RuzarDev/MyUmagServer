import { Body, Controller, Get, Headers, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/orders.dto';
import { OrdersService } from './orders.service';
import {Request} from 'express';
import { CreateTechCardOrderDto } from "./dto/createTechCardOrder.dto";

@Controller('order')

export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {
  }


  @Get()
  getOrdersByToken(@Req() req: Request): Promise<any> {
    return this.ordersService.findAll(req)
  }
  @Get('byShift/:id')
  getOrderByShiftPos(@Param('id') id, @Req() req: Request){
    return this.ordersService.getOrderByShiftPos(id,req)
  }

  @Post('tech-card-order')
  createTechCardOrder(@Body() dto: CreateTechCardOrderDto, @Req() req: Request) {
  return this.ordersService.createTechCardOrder(dto, req);
}






}
