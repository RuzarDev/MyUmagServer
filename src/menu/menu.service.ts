import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from './menu.entity';
import { Repository } from 'typeorm';
import { MenuDto } from './dto/menu.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { TechCardEntity } from "../ingridients/tech_cards.entity";
import { TechCardIngredientEntity } from "../ingridients/tech_card_ingredients.entity";
import { IngredientsEntity } from "../ingridients/ingredients.entity";



@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,

    @InjectRepository(IngredientsEntity)
    private readonly ingredientRepository: Repository<IngredientsEntity>,

    @InjectRepository(TechCardEntity)
    private readonly techCardRepository: Repository<TechCardEntity>,

    @InjectRepository(TechCardIngredientEntity)
    private readonly techCardIngredientRepository: Repository<TechCardIngredientEntity>,

    private readonly AuthService: AuthService,
  ) {}

  async createMenuItem(dto: MenuDto, @Req() req: Request): Promise<MenuEntity> {
    const token = req.cookies.access_token;
    const admin = await this.AuthService.validateByToken(token);

    if (!admin) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (dto.ingredients && dto.ingredients.length > 0) {
      const ingredientIds = dto.ingredients.map(i => i.ingredientId);
      const ingredients = await this.ingredientRepository.findByIds(ingredientIds);

      if (ingredients.length !== ingredientIds.length) {
        throw new HttpException('Some ingredients not found', HttpStatus.BAD_REQUEST);
      }

      let totalCost = 0;

      const techCardIngredients: TechCardIngredientEntity[] = [];

      for (const ingredientDto of dto.ingredients) {
        const ingredient = ingredients.find(i => i.id === ingredientDto.ingredientId);
        if (!ingredient) continue;

        totalCost += ingredient.cost * ingredientDto.quantity;

        const techCardIngredient = this.techCardIngredientRepository.create({
          ingredient,
          amount: ingredientDto.quantity,
          admin,
        });

        techCardIngredients.push(techCardIngredient);
      }

      const menu = this.menuRepository.create({
        name: dto.name,
        category: dto.category,
        cost: totalCost,
        price: dto.price,
        admin,
        ingredients: techCardIngredients,
      });

      return await this.menuRepository.save(menu);
    }

    // если нет ингредиентов — простое создание
    const newMenuItem = this.menuRepository.create({
      name: dto.name,
      category: dto.category,
      price: dto.price,
      cost: null,
      admin,
    });

    return await this.menuRepository.save(newMenuItem);
  }




  async deleteMenuItem(id: number, @Req() req: Request): Promise<MenuEntity> {
    const token = req.cookies.access_token;
    const admin = await this.AuthService.validateByToken(token);

    if (!admin) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (typeof id !== 'number') {
      throw new HttpException('Invalid ID type', HttpStatus.BAD_REQUEST);
    }

    const menuItem = await this.menuRepository.findOneBy({ id });
    if (!menuItem) {
      throw new HttpException(`Menu item with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.menuRepository.delete({
      id,
      admin: { id: admin.id },
    });

    return menuItem;
  }

  async findAllMenu(@Req() req: Request): Promise<MenuEntity[]> {
    const token = req.cookies.access_token;
    const admin = await this.AuthService.validateByToken(token);

    if (!admin) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return await this.menuRepository.find({
      where: {
        admin: {
          id: admin.id,
        },
      },
    });
  }

  async findOne(id: number): Promise<MenuEntity> {
    return await this.menuRepository.findOneBy({ id });
  }

  async getCategories(@Req() req: Request): Promise<string[]> {
    const token = req.cookies.access_token;
    const admin = await this.AuthService.validateByToken(token);

    if (!admin) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const categories = await this.menuRepository
      .createQueryBuilder('menu')
      .select('DISTINCT menu.category', 'category')
      .leftJoin('menu.admin', 'admin')
      .where('admin.id = :adminId', { adminId: admin.id })
      .getRawMany();

    return categories.map((item) => item.category);
  }
}
