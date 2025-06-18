// create-supply.dto.ts
export class CreateSupplyDto {
  date: string;
  supplier: string;
  amount: number;
  items: Array<{
    menuItemId: number;
    quantity: number;
    price: number; // обязательно!
  }>;
}
