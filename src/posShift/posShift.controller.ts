import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { PosShiftService } from './posShift.service';
import { Request } from 'express';

@Controller('posShift')
export class PosShiftController {
  constructor(private readonly posShiftService: PosShiftService ) {
  }
  @Get('all')
  async getAllShifts(@Req() req: Request){
    return this.posShiftService.getShifts(req)
  }
  @Get()
  async getOpenShift(@Req() req: Request){
    return this.posShiftService.findOpenShift(req);
  }
  @Post()
  async openShift(@Body() cashdrawer,@Req() req: Request){
    return this.posShiftService.openNewShift(cashdrawer,req);
  }
  @Post('close',)
  async closeShift(@Body() cashDrawer: number,@Req() req: Request){
    return this.posShiftService.closeShift(cashDrawer,req)
  }

}