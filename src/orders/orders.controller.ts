import { Body, Controller, Get, Headers, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/orders.dto';
import { OrdersService } from './orders.service';
import {Request} from 'express';

@Controller('order')

export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {
  }

  @Post()
  CreateOrder(@Body() dto: CreateOrderDto,@Req() req: Request): Promise<any> {
    return this.ordersService.create(dto, req);
  }
  @Get()
  getOrdersByToken(@Req() req: Request): Promise<any> {
    return this.ordersService.findAll(req)
  }
  @Get('byShift/:id')
  getOrderByShiftPos(@Param('id') id, @Req() req: Request){
    return this.ordersService.getOrderByShiftPos(id,req)
  }






}
