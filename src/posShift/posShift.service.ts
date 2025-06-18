import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PosShiftEntity } from './posShift.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

@Injectable()
export class PosShiftService {
  constructor(
    @InjectRepository(PosShiftEntity)
    private posShiftRepository: Repository<PosShiftEntity>,
    private AuthService: AuthService) {
  }
  async findOpenShift(req){
    const bearerToken = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(bearerToken);
  return this.posShiftRepository.find({where:{isOpen:true,admin:adminToken.id}});
  }
  async openNewShift(cashDrawerInput, req) {
    const cashDrawer = parseInt(cashDrawerInput.cashDrawer || cashDrawerInput); // гарантируем число
    if (isNaN(cashDrawer)) throw new BadRequestException('Invalid cashDrawer value');

    const bearerToken = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(bearerToken);

    const existingShifts = await this.findOpenShift(req);
    if (existingShifts.length > 0) {
      return existingShifts[0];
    }

    const shift = this.posShiftRepository.create({
      openedAt: new Date(),
      isOpen: true,
      card: 0,
      cash: 0,
      openedCashDrawer: cashDrawer,
      admin: adminToken,
    });

    return this.posShiftRepository.save(shift);
  }

  async closeShift(cash: any,req: Request){
    const cashDrawer = parseInt(cash.cashDrawer); // гарантируем число

    const bearerToken = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(bearerToken);
    const shift =await this.posShiftRepository.findOneBy({isOpen:true,admin:adminToken.id});
    if(!shift) throw new UnauthorizedException("PosShift not found")
    shift.isOpen = false
    shift.closedAt = new Date();
    shift.closedCashDrawer = cashDrawer
    return await this.posShiftRepository.save(shift)
  }
  async getShifts (req){
    const bearerToken = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(bearerToken);
    return this.posShiftRepository.find({where:{admin:adminToken.id}});
  }

}