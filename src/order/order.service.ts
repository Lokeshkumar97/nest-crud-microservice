import { Inject, Injectable } from '@nestjs/common';
import { Prisma, Order } from '@prisma/client';
import { PrismaService } from 'src/db.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
    constructor(@Inject(HttpService) private httpService: HttpService, private prisma: PrismaService) { }

    async CreateOrder(createInput: Prisma.OrderCreateInput): Promise<Order | string | null> {
        try {
            const prodResp = await lastValueFrom(this.httpService.get(`http://localhost:3000/products/${createInput.productId}`))
            
            if (prodResp.data.response) {
                return this.prisma.order.create({ data: createInput })
            } else {
                return "This product is not available to place the order."
            }
        } catch (err) {
            console.log("Error occured while creating the Order", err)
            return err.message
        }
    }

    async GetOrder(uniqueInput: Prisma.OrderWhereUniqueInput): Promise<Order | string> {
        try {
            return this.prisma.order.findUnique({ where: uniqueInput })
        } catch (err) {
            console.log("Error occured while fetch the single Order", err)
            return err.message
        }
    }

    async GetOrders(whereInput: Prisma.OrderWhereInput): Promise<Order[] | string> {
        try {
            if (whereInput.productId) {
                whereInput.productId = {in: whereInput.productId.toString().split(",")}
            }
            return this.prisma.order.findMany({ where: whereInput })
        } catch (err) {
            console.log("Error occured while fetch multiple Orders", err)
            return err.message
        }
    }

    async UpdateOrder(uniqueInput: Prisma.OrderWhereUniqueInput, updateInput: Prisma.OrderUpdateInput): Promise<Order | string | null> {
        try {
            return this.prisma.order.update({ where: uniqueInput, data: updateInput })
        } catch (err) {
            console.log("Error occured while updating the product data", err)
            return err.message
        }
    }

    async DeleteOrder(uniqueInput: Prisma.OrderWhereUniqueInput): Promise<Order | string | null> {
        try {
            return this.prisma.order.delete({ where: uniqueInput })
        } catch (err) {
            console.log("Error occured while updating the product data", err)
            return err.message
        }
    }

    async GetOrdersByProductWise(whereInput: Prisma.OrderWhereInput): Promise<any> {
        try {
            const orders = await this.prisma.order.findMany({ where: whereInput })
            const orderMap = new Map<string, any[]>()
            for (const order of orders) {
                if (orderMap.get(order.productId)) {
                    const value = orderMap.get(order.productId)
                    value.push(order)
                    orderMap.set(order.productId, value)
                } else {
                    orderMap.set(order.productId, [order])
                }
            }
            const productIds = [... new Set(Object.keys(Object.fromEntries(orderMap)))].join(",")
            const prodResp = await lastValueFrom(this.httpService.get(`http://localhost:3000/products?id=${productIds}`))
            
           
            for (const product of prodResp.data.response) {
                product["orders"] = orderMap.get(product.id) || []
            }
            return prodResp.data.response
        } catch (err) {
            console.log("Error occured while fetching Order list along with product", err)
            return err.message
        }
    }
}
