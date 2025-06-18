import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeesEntity } from './employees.entity';
import { Repository } from 'typeorm';
import { EmployeesDto } from './dto/employees.dto';
import { AuthService } from '../auth/auth.service';
import {Request} from 'express';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(EmployeesEntity)
    private EmployeesRepository: Repository<EmployeesEntity>,
    private AuthService: AuthService,
  ) {}
  async findAll(): Promise<EmployeesEntity[]> {
    return await this.EmployeesRepository.find();
  }
  async findOne(id: number): Promise<EmployeesEntity> {
    return await this.EmployeesRepository.findOneBy({ id });
  }

  async create(
    Employee: EmployeesDto,
    @Req() req: Request,
  ): Promise<EmployeesEntity> {
    const bearerToken = req.cookies.access_token
    const adminToken = await this.AuthService.validateByToken(bearerToken);
    return await this.EmployeesRepository.save({...Employee,admin: adminToken.id});
  }

  async update(
    id: number,
    updateEmployees: EmployeesDto,
  ): Promise<EmployeesEntity> {
    // Найти существующего клиента по ID
    const existingEmployees = await this.EmployeesRepository.findOneBy({ id });
    if (!existingEmployees) {
      throw new HttpException(
        `Customer with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Обновить существующего клиента данными из updateCustomerDto
    const updatedEmployees = Object.assign(existingEmployees, updateEmployees);

    // Сохранить обновлённого клиента в базе данных
    return await this.EmployeesRepository.save(updatedEmployees);
  }

  async delete(id: number): Promise<EmployeesEntity> {
    const employee = await this.EmployeesRepository.findOneBy({ id });
    if (!employee) {
      throw new HttpException(
        'employee with ID not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.EmployeesRepository.delete(id);
    return employee;
  }
}
