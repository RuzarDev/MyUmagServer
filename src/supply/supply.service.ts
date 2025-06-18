import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplyEntity } from './supply.entity';
import { SupplyItemEntity } from './supplyItemEntity.entity';
import { MenuEntity } from '../menu/menu.entity';
import { AuthService } from '../auth/auth.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { Request } from 'express';

@Injectable()
export class SupplyService {
  constructor(
    @InjectRepository(SupplyEntity)
    private readonly supplyRepository: Repository<SupplyEntity>,

    @InjectRepository(SupplyItemEntity)
    private readonly supplyItemRepository: Repository<SupplyItemEntity>,

    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,

    private readonly authService: AuthService
  ) {}

  async createSupply(dto: CreateSupplyDto, @Req() req: Request): Promise<SupplyEntity> {
    const token = req.cookies.access_token;

    const admin = await this.authService.validateByToken(token);
    if (!admin) {
      throw new Error('Unauthorized');
    }

    const supply = this.supplyRepository.create({
      date: new Date(),
      supplier: dto.supplier,
      amount: dto.amount,
      admin: admin.id
    });

    const savedSupply = await this.supplyRepository.save(supply);

    for (const item of dto.items) {
      const menuItem = await this.menuRepository.findOneBy({ id: item.menuItemId });
      if (!menuItem) continue;

      const supplyItem = this.supplyItemRepository.create({
        supply: savedSupply,
        menuItem,
        quantity: item.quantity,
        price: item.price,

      });

      await this.supplyItemRepository.save(supplyItem);

      // Обновляем себестоимость (cost) товара в MenuEntity
      const totalExistingCost = menuItem.cost * (menuItem.stock || 0);
      const totalNewCost = item.price * item.quantity;
      const totalQuantity = (menuItem.stock || 0) + item.quantity;

      if (totalQuantity > 0) {
        menuItem.cost = (totalExistingCost + totalNewCost) / totalQuantity;
        menuItem.stock = totalQuantity; // Если используете складской учет
        await this.menuRepository.save(menuItem);
      }
    }

    return this.supplyRepository.findOne({
      where: { id: savedSupply.id },
      relations: ['items', 'items.menuItem'],
    });
  }
  async getAllSupply(req) {
    const token = req.cookies?.access_token;

    const admin = await this.authService.validateByToken(token);
    if (!admin) {
      throw new Error('Unauthorized');
    }
    return this.supplyRepository.find({
      where: { admin: admin.id },
      relations: ['items', 'items.menuItem'], // Подгружаем связанные элементы и товары
    });
  }
}
