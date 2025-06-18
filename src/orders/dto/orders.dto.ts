import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  menuId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  @IsNotEmpty()
  @IsString()
  orderDate: string;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;
  typeOfPayment: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto) // Преобразуем элементы массива в CreateOrderItemDto
  menuItems: CreateOrderItemDto[]; // Массив объектов CreateOrderItemDto
}
