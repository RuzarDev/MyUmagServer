import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
   Req,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import {Request} from 'express'

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(@Req() req: Request): Promise<Customer[]> {
    return this.customersService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customersService.findOne(Number(id));
  }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto,@Req() req: Request): Promise<Customer> {
    return this.customersService.create(createCustomerDto, req);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(Number(id), updateCustomerDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
    return this.customersService.delete(Number(id),req);
  }
}
