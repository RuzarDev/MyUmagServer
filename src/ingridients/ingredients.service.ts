import { TechCardIngredientEntity } from "./tech_card_ingredients.entity";
import { IngredientsEntity } from "./ingredients.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientsEntity)
    private readonly ingredientRepository: Repository<IngredientsEntity>,

    @InjectRepository(TechCardIngredientEntity)
    private readonly techCardIngredientRepository: Repository<TechCardIngredientEntity>,

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
  }}