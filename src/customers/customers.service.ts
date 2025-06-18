import { Injectable, HttpException, HttpStatus, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AuthService } from '../auth/auth.service';
import {Request} from "express"

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    private AuthService: AuthService,
  ) {}

  async findAll(@Req() req: Request): Promise<Customer[]> {
    const token = req.cookies.access_token
    const adminToken = await this.AuthService.validateByToken(token);
    if (!adminToken) {
      throw new HttpException('not authorized', HttpStatus.NOT_FOUND);
    }
    return await this.customersRepository.find({where:{
    admin: {
      id: adminToken.id,
    }
      }});
  }

  async findOne(id: number): Promise<Customer> {
    return await this.customersRepository.findOneBy({ id });
  }

  async create(createCustomerDto: CreateCustomerDto, @Req() req: Request) {
    const token = req.cookies.access_token
    const adminToken = await this.AuthService.validateByToken(token);
    if (!adminToken) {
      throw new HttpException('not authorized', HttpStatus.NOT_FOUND);
    }
    const customer = await this.customersRepository.create({
      ...createCustomerDto,
      admin: adminToken.id,
    });
    const savedCustomer = await this.customersRepository.save(customer);
    return customer;
  }

  async delete(id: number,@Req() req: Request): Promise<void> {
    const token = req.cookies.access_token
    const adminToken = await this.AuthService.validateByToken(token);
    if (!adminToken) {
      throw new HttpException('not authorized', HttpStatus.NOT_FOUND);
    }
    await this.customersRepository.delete({
      id: id,
      admin: {
        id: adminToken.id,
      },
    });

  }

  async update(
    id: number,
    updateCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    // Найти существующего клиента по ID
    const existingCustomer = await this.customersRepository.findOneBy({ id });
    if (!existingCustomer) {
      throw new HttpException(
        `Customer with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Обновить существующего клиента данными из updateCustomerDto
    const updatedCustomer = Object.assign(existingCustomer, updateCustomerDto);

    // Сохранить обновлённого клиента в базе данных
    return await this.customersRepository.save(updatedCustomer);
  }
}
