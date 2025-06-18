import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async findById(id: number): Promise<AdminEntity> {
    return await this.adminRepository.findOneBy({ id });
  }
  async findByPhone(phone: string): Promise<AdminEntity> {
    return await this.adminRepository.findOneBy({ phone });
  }
  
}
