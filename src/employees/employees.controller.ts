import {
  Body,
  Controller,
  Delete,
  Get, Headers,
  Param,
  Post,
  Put, Req, UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesEntity } from './employees.entity';
import { EmployeesDto } from './dto/employees.dto';
import {JwtAuthGuard} from "../auth/jwt.strategy/jwtAuthGuard";
import { Request } from 'express';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAllEmployees() {
    return this.employeesService.findAll();
  }
  @Get(':id')
  findOneEmployee(@Param() id: number): Promise<EmployeesEntity> {
    return this.employeesService.findOne(id);
  }
  @Post()
  createEmployes(@Body() dto: EmployeesDto,@Req() req: Request): Promise<EmployeesEntity> {
    return this.employeesService.create(dto,req);
  }
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: EmployeesDto) {
    return this.employeesService.update(+id, dto);
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.employeesService.delete(id);
  }
}
