export class CreateTechCardOrderDto {
  employeeId: number;
  customerId: number;
  typeOfPayment: 'cash' | 'card';
  orderDate: Date;
  techCardItems: {
    techCardId: number;
    quantity: number;
  }[];
}
