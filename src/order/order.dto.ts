import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderData {
  id?: string;

  @IsNotEmpty()
  @IsString()
  productId: string;
  address: string;
}