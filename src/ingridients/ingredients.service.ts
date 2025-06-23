import { TechCardIngredientEntity } from "./tech_card_ingredients.entity";
import { IngredientsEntity } from "./ingredients.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { TechCardEntity } from "./tech_cards.entity";

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientsEntity)
    private readonly ingredientRepository: Repository<IngredientsEntity>,

    @InjectRepository(TechCardIngredientEntity)
    private readonly techCardIngredientRepository: Repository<TechCardIngredientEntity>,
    @InjectRepository(TechCardEntity)
    private readonly techCardRepository: Repository<TechCardEntity>,

    private readonly authService: AuthService
  ) {}

  private async getAdminFromRequest(req): Promise<any> {
    const token = req.cookies.access_token;
    const admin = await this.authService.validateByToken(token);
    if (!admin) throw new Error('Unauthorized');
    return admin;
  }

  async createIngredient(req, dto) {
    const admin = await this.getAdminFromRequest(req);

    const ingredient = this.ingredientRepository.create({
      ...dto,
      admin: admin,
    });

    return await this.ingredientRepository.save(ingredient);
  }

  async updateIngredient(req, dto) {
    const admin = await this.getAdminFromRequest(req);

    const ingredient = await this.ingredientRepository.findOne({ where: { id: dto.id } });
    if (!ingredient) throw new Error('Ingredient not found');

    ingredient.name = dto.name;
    ingredient.category = dto.category;
    ingredient.unit = dto.unit;
    ingredient.admin = admin;

    return await this.ingredientRepository.save(ingredient);
  }

  async getIngredients(req) {
    const admin = await this.getAdminFromRequest(req);
    return await this.ingredientRepository.find({
      where: { admin: { id: admin.id } },
    });
  }
  async CreateTechCard(req, dto) {
    const admin = await this.getAdminFromRequest(req);

    // 1. Получаем ингредиенты из БД
    const ingredientIds = dto.ingredients.map(i => i.ingredientId);
    const ingredients = await this.ingredientRepository.findByIds(ingredientIds);

    if (ingredients.length !== ingredientIds.length) {
      throw new Error('Some ingredients not found');
    }

    // 2. Вычисляем себестоимость
    let totalCost = 0;
    const techCardIngredients = dto.ingredients.map(ingredientDto => {
      const ingredient = ingredients.find(i => i.id === ingredientDto.ingredientId);
      const cost = ingredient.cost * ingredientDto.quantity;
      totalCost += cost;

      return this.techCardIngredientRepository.create({
        ingredient,
        amount: ingredientDto.quantity,
        admin,
      });
    });

    // 3. Создаем техкарту
    const techCard = this.techCardRepository.create({
      name: dto.name,
      category: dto.category,
      cost: totalCost,
      admin,
      ingredients: techCardIngredients,
    });

    return await this.techCardRepository.save(techCard);
  }
  async UpdateTechCard(req, dto) {
    const admin = await this.getAdminFromRequest(req);

    // 1. Находим существующую техкарту
    const techCard = await this.techCardRepository.findOne({
      where: { id: dto.id, admin: { id: admin.id } },
      relations: ['ingredients'],
    });

    if (!techCard) {
      throw new Error('TechCard not found');
    }

    // 2. Удаляем старые связи
    await this.techCardIngredientRepository.delete({ techCard: { id: techCard.id } });

    // 3. Получаем ингредиенты из базы
    const ingredientIds = dto.ingredients.map(i => i.ingredientId);
    const ingredients = await this.ingredientRepository.findByIds(ingredientIds);

    if (ingredients.length !== ingredientIds.length) {
      throw new Error('Some ingredients not found');
    }

    // 4. Создаем новые связи
    let totalCost = 0;
    const techCardIngredients = dto.ingredients.map(ingredientDto => {
      const ingredient = ingredients.find(i => i.id === ingredientDto.ingredientId);
      const cost = ingredient.cost * ingredientDto.quantity;
      totalCost += cost;

      return this.techCardIngredientRepository.create({
        techCard,
        ingredient,
        amount: ingredientDto.quantity,
        admin,
      });
    });

    // 5. Обновляем техкарту
    techCard.name = dto.name;
    techCard.category = dto.category;
    techCard.cost = totalCost;
    techCard.ingredients = techCardIngredients;

    // 6. Сохраняем
    return await this.techCardRepository.save(techCard);
  }
  async getTechCards(req) {
    const admin = await this.getAdminFromRequest(req);

    return await this.techCardRepository.find({
      where: { admin: { id: admin.id } },
      relations: ['ingredients', 'ingredients.ingredient'], // подтягиваем связи
    });
  }

}
