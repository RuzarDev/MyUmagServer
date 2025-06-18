import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from './menu.entity';
import { Repository } from 'typeorm';
import { MenuDto } from './dto/menu.dto';
import { AuthService } from '../auth/auth.service';
import {Request} from 'express';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    private AuthService: AuthService,
  ) {}
  async createMenuItem(dto: MenuDto, @Req() req: Request): Promise<MenuEntity> {
    const token = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(token);
    const newMenuItem = await this.menuRepository.create({
      ...dto,
      admin: adminToken.id,
    });
    const menuItem = await this.menuRepository.save(newMenuItem);
    return menuItem;
  }
  async updateMenuItem(dto: MenuDto): Promise<MenuEntity> {
    const updatedMenuItem = await this.menuRepository.save(dto);
    return updatedMenuItem;
  }

  async deleteMenuItem(id: number,@Req() req: Request): Promise<MenuEntity> {
    const token = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(token);
    if(!adminToken){
      throw new HttpException('not authorized', HttpStatus.NOT_FOUND);
    }
    // Убедитесь, что id — это число, а не объект или строка
    if (typeof id !== 'number') {
      throw new Error(`Invalid id type, expected number but got ${typeof id}`);
    }

    const menuItem = await this.menuRepository.findOneBy({ id });
    if (!menuItem) {
      throw new HttpException(
        `Menu item with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.menuRepository.delete({
      id: id,
      admin: {
        id: adminToken.id,
      },
    });
    return menuItem;
  }

  async findAllMenu(@Req() req: Request): Promise<MenuEntity[]> {
    const token = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(token);

    return await this.menuRepository.find({where:{
      admin:{
        id: adminToken.id,
      }
      }});
  }
  async findOne(id: number): Promise<MenuEntity> {
    return await this.menuRepository.findOneBy({ id });
  }
  async getCategories(@Req() req: Request): Promise<string[]> {
    const token = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(token);

    if (!adminToken) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    const categories = await this.menuRepository
      .createQueryBuilder('menu')
      .select('DISTINCT menu.category', 'category')
      .leftJoin('menu.admin', 'admin')
      .where('admin.id = :adminId', { adminId: adminToken.id })
      .getRawMany();

    return categories.map((item) => item.category);
  }
}
