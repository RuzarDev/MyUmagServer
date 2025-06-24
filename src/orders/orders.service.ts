import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { In } from 'typeorm';

import { OrdersEntity } from './orders.entity';
import { EmployeesEntity } from '../employees/employees.entity';
import { MenuEntity } from '../menu/menu.entity';
import { CreateOrderDto } from './dto/orders.dto';
import { Customer } from '../customers/customer.entity';
import { OrderItemEntity } from './ordersItems.entity';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { PosShiftService } from '../posShift/posShift.service';
import { PosShiftEntity } from '../posShift/posShift.entity';
import { CreateTechCardOrderDto } from "./dto/createTechCardOrder.dto";
import { IngredientsEntity } from "../ingridients/ingredients.entity";
import { TechCardEntity } from "../ingridients/tech_cards.entity";
import { TechCardIngredientEntity } from "../ingridients/tech_card_ingredients.entity";
import { DataSource } from 'typeorm';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
    @InjectRepository(EmployeesEntity)
    private readonly employeesRepository: Repository<EmployeesEntity>,
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    @InjectRepository(MenuEntity)
    private readonly menuRepository: Repository<MenuEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemsRepository: Repository<OrderItemEntity>,
    private AuthService: AuthService,
    private posShiftService: PosShiftService,
    @InjectRepository(PosShiftEntity)
    private readonly posShiftRepository: Repository<PosShiftEntity>,
    @InjectRepository(TechCardEntity)
    private readonly techCardRepository: Repository<TechCardEntity>,
    @InjectRepository(TechCardIngredientEntity)
    private readonly techCardIngredientRepository: Repository<TechCardIngredientEntity>,
    @InjectRepository(IngredientsEntity)
    private readonly ingredientsRepository: Repository<IngredientsEntity>,
    private readonly dataSource: DataSource,
  ) {
  }

  // Создание нового заказа
  async create(dto: CreateOrderDto, @Req() req: Request): Promise<OrdersEntity> {
    const openedShift = await this.posShiftRepository.findOne({ where: { isOpen: true } })
    const { employeeId, customerId, orderDate, totalAmount, menuItems, typeOfPayment } = dto;

    // Проверка существования сотрудника и клиента
    const employee = await this.employeesRepository.findOne({ where: { id: employeeId } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    const customer = await this.customersRepository.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }


    // Создаем новый заказ
    const bearerToken = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(bearerToken);
    const newOrder = this.ordersRepository.create({
      employee,
      customer,
      orderDate,
      totalAmount,
      admin: adminToken.id,
      posShiftId: openedShift.id,
      typeOfPayment


    });
    const shift = await this.posShiftRepository.findOneBy({ id: openedShift.id });
    if (!shift) throw new NotFoundException('Смена не найдена');
    if (typeOfPayment === 'cash') {
      shift.cash += totalAmount;
      shift.cashPool += totalAmount;
      shift.openedCashDrawer += totalAmount
    } else if (typeOfPayment === 'card') {
      shift.card += totalAmount
      shift.cashPool += totalAmount;
    }

    await this.posShiftRepository.save(shift);

    // Сохраняем заказ
    await this.ordersRepository.save(newOrder);

    // Добавляем элементы заказа
    for (const item of menuItems) {
      const menu = await this.menuRepository.findOne({ where: { id: item.menuId } });
      if (!menu) {
        throw new NotFoundException(`Menu item with ID ${item.menuId} not found`);
      }

      const orderItem = this.orderItemsRepository.create({
        order: newOrder,
        menu: menu,
        quantity: item.quantity,
      });

      await this.orderItemsRepository.save(orderItem);

      menu.stock -= item.quantity;
      await this.menuRepository.save(menu);


      await this.menuRepository.save(menu);
    }

    return newOrder;
  }

  // Удаление заказа
  async delete(id: number): Promise<OrdersEntity> {
    const order = await this.ordersRepository.findOne({ where: { id: id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    await this.ordersRepository.delete(id);
    return order;
  }

  // Получение всех заказов с преобразованием времени
  async findAll(@Req() req: Request): Promise<(Omit<OrdersEntity, 'orderDate'> & { orderDate: string })[]> {
    const bearerToken = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(bearerToken);

    const orders = await this.ordersRepository.find({
      where: {
        admin: { id: adminToken.id },
      },
      relations: ['orderItems', 'orderItems.menu'],
    });

    return orders.map((order) => {
      const orderDateUtc = new Date(order.orderDate);
      const zonedDate = toZonedTime(orderDateUtc, 'Asia/Almaty');
      const formattedDate = format(zonedDate, 'dd.MM.yyyy HH:mm');

      // Возвращаем объект, где orderDate заменён на строку
      const { orderDate, ...rest } = order;
      return {
        ...rest,
        orderDate: formattedDate,
      };
    });
  }

  // Получение одного заказа по ID
  async findOne(id: number): Promise<OrdersEntity> {
    const order = await this.ordersRepository.findOne({ where: { id: id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getOrderByShiftPos(id, req) {
    const bearerToken = req.cookies.access_token;
    const adminToken = await this.AuthService.validateByToken(bearerToken);
    return await this.ordersRepository.find({ where: { posShiftId: id, admin: adminToken.id } })

  }

  async createTechCardOrder(dto: CreateTechCardOrderDto, @Req() req: Request): Promise<OrdersEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { employeeId, customerId, techCardItems, orderDate, typeOfPayment } = dto;

      const openedShift = await this.posShiftRepository.findOne({ where: { isOpen: true } });
      if (!openedShift) throw new NotFoundException('Открытая смена не найдена');

      const employee = await this.employeesRepository.findOne({ where: { id: employeeId } });
      if (!employee) throw new NotFoundException(`Сотрудник с ID ${employeeId} не найден`);

      const customer = await this.customersRepository.findOne({ where: { id: customerId } });
      if (!customer) throw new NotFoundException(`Клиент с ID ${customerId} не найден`);

      const bearerToken = req.cookies.access_token;
      const admin = await this.AuthService.validateByToken(bearerToken);

      const techCardIds = techCardItems.map(i => i.techCardId);
      const techCards = await this.techCardRepository.find({
        where: { id: In(techCardIds) },
        relations: ['ingredients', 'ingredients.ingredient'],
      });

      // Проверка остатков
      for (const item of techCardItems) {
        const techCard = techCards.find(tc => tc.id === item.techCardId);
        if (!techCard) throw new NotFoundException(`TechCard с ID ${item.techCardId} не найдена`);


      }

      // Списание остатков
      for (const item of techCardItems) {
        const techCard = techCards.find(tc => tc.id === item.techCardId);
        for (const tci of techCard.ingredients) {
          tci.ingredient.stock -= tci.amount * item.quantity;
          await queryRunner.manager.save(IngredientsEntity, tci.ingredient);
        }
      }

      // Расчет общей суммы
      const totalAmount = techCardItems.reduce((sum, item) => {
        const tc = techCards.find(t => t.id === item.techCardId);
        return sum + (tc.price * item.quantity);
      }, 0);

      // Создание заказа
      const order = this.ordersRepository.create({
        employee,
        customer,
        orderDate,
        totalAmount,
        admin: admin.id,
        posShiftId: openedShift.id,
        typeOfPayment,
      });
      await queryRunner.manager.save(order);

      // Создание элементов заказа
      for (const item of techCardItems) {
        const techCard = techCards.find(tc => tc.id === item.techCardId);
        const orderItem = this.orderItemsRepository.create({
          order,
          techCard,
          quantity: item.quantity,
        });
        await queryRunner.manager.save(orderItem);
      }

      // Обновление POS-смены
      const shift = await this.posShiftRepository.findOneBy({ id: openedShift.id });
      if (!shift) throw new NotFoundException('Смена не найдена');

      if (typeOfPayment === 'cash') {
        shift.cash += totalAmount;
        shift.cashPool += totalAmount;
        shift.openedCashDrawer += totalAmount;
      } else {
        shift.card += totalAmount;
        shift.cashPool += totalAmount;
      }
      await queryRunner.manager.save(shift);

      await queryRunner.commitTransaction();
      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }


}

