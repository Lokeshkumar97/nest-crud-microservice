import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductData {
  id?: string;

  @IsNotEmpty()
  @IsString()
  productName: string;

  productType?:string;
  @IsNotEmpty()
  @IsNumber()
  productCost: number;
}