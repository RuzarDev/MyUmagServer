import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.strategy/jwt.interface';
import { RegistrationDto } from './dto/registration.dto';
import { AdminEntity } from '../admin/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response, Request } from "express";


@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}

  async validateAdmin(phone: string, pass: string): Promise<any> {
    const admin = await this.adminService.findByPhone(phone);
    if (admin && (await bcrypt.compare(pass, admin.password))) {
      const { password, ...result } = admin;
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(admin: any, response: Response): Promise<any> {
    const payload: JwtPayload = { id: admin.id, phone: admin.phone };
    const token = await this.jwtService.sign(payload);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Только по HTTPS в продакшене
      sameSite: 'strict',
      maxAge: 3600000, // 1 час
    });

    return { message: 'Login successful' };
  }


  async registration(dto: RegistrationDto) {
    const admin = await this.adminService.findByPhone(dto.phone);
    if (admin) {
      throw new HttpException('User already exists', HttpStatus.UNAUTHORIZED);
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const registeredAdmin = { ...dto, password: hashedPassword };
    const res = await this.adminRepository.save(registeredAdmin);
    return {
      access_token: await this.jwtService.sign({
        id: res.id,
        phone: res.phone,
      }),
    };
  }

  async validateByToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      const admin = await this.adminService.findById(decoded.id);
      if (!admin) {
        throw new UnauthorizedException();
      }
      return { id: decoded.id, phone: decoded.phone };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}