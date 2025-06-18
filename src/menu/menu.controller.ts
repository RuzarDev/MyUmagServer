  import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
   Req,
  } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuDto } from './dto/menu.dto';
import { Request } from 'express';
@Controller('menu')

export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Post()
  create(@Body() dto: MenuDto, @Req() req: Request) {
    return this.menuService.createMenuItem(dto, req);
  }
  @Post('/update')
  update(@Body() dto: MenuDto) {
    return this.menuService.updateMenuItem(dto);
  }
  @Delete(':id')
  deleteMenuItem(@Param('id') id: string,@Req() req: Request) {
    return this.menuService.deleteMenuItem(Number(id),req);
  }
  @Get()
  findAll(@Req() req: Request) {
    return this.menuService.findAllMenu(req);
  }
  @Get('/categories')
  getAllCategories(@Req() req: Request) {
    return this.menuService.getCategories(req)
  }
  @Get(':id')
  findOne(id: number) {
    return this.menuService.findOne(id);
  }

}
