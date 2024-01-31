import { Controller, Get, Post, Put, Delete, Body, Param, Query, ValidationPipe } from '@nestjs/common';
import {  Prisma } from '@prisma/client';
import { OrderData } from './order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(
    private orderService: OrderService
  ) { }

  @Post('create')
  async Create(@Body(new ValidationPipe()) reqBody: OrderData): Promise<any> {
    const result = await this.orderService.CreateOrder(reqBody)
    console.log("result:: ",result);
    
    if (typeof result == 'string') {
      return {
        response: null,
        errorMessage: result,
      }
    } else {
      return {
        response: result,
        errorMessage: null
      }
    }
  }

  @Get('by/:id')
  async getOrder(@Param('id') id: string): Promise<any> {
    
    const result = await this.orderService.GetOrder({ id: id })
    if (typeof result == 'string') {
      return {
        response: null,
        errorMessage: result,
      }
    } else {
      return {
        response: result,
        errorMessage: null
      }
    }
  }

  @Get()
  async getOrders(@Query() queryParams: Prisma.OrderWhereInput): Promise<any> {
    const result = await this.orderService.GetOrders(queryParams)
    if (typeof result == 'string') {
      return {
        response: null,
        errorMessage: result,
      }
    } else {
      return {
        response: result,
        errorMessage: null
      }
    }
  }

  @Get('productWise')
  async getOrdersByProductWise(@Query() queryParams: Prisma.OrderWhereInput): Promise<any> {
    const result = await this.orderService.GetOrdersByProductWise(queryParams)
    if (typeof result == 'string') {
      return {
        response: null,
        errorMessage: result,
      }
    } else {
      return {
        response: result,
        errorMessage: null
      }
    }
  }

  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() reqBody: OrderData): Promise<any> {
    const result = await this.orderService.UpdateOrder({ id: id }, reqBody)
    if (typeof result == 'string') {
      return {
        response: null,
        errorMessage: result,
      }
    } else {
      return {
        response: result,
        errorMessage: null
      }
    }
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<any> {
    const result = await this.orderService.DeleteOrder({ id: id })
    if (typeof result == 'string') {
      return {
        response: null,
        errorMessage: result,
      }
    } else {
      return {
        response: result,
        errorMessage: null
      }
    }
  }
}
