import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { Request } from 'express';

@Controller('supply')
export class SupplyController {
  constructor(private readonly SupplyService: SupplyService) {}
  @Post()
  createSupply(@Body() dto,@Req() req: Request){
    return this.SupplyService.createSupply(dto,req)
  }
  @Get()
  getSupplys(@Req() req: Request){
    return this.SupplyService.getAllSupply(req)
  }
}