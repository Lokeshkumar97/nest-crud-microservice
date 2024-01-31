import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "src/db.service";
import { Product, Prisma } from "@prisma/client";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ProductService {
    constructor(@Inject(HttpService) private httpService: HttpService, private prisma: PrismaService) { }

    async CreateProduct(createInput: Prisma.ProductCreateInput): Promise<Product | string | null> {
        try {
            return this.prisma.product.create({ data: createInput })
        } catch (err) {
            console.log("Error occured while creating the product", err)
            return err.message
        }
    }

    async GetProduct(uniqueInput: Prisma.ProductWhereUniqueInput): Promise<Product | string> {
        try {
            return this.prisma.product.findUnique({ where: uniqueInput })
        } catch (err) {
            console.log("Error occured while fetch the single product", err)
            return err.message
        }
    }

    async GetProducts(whereInput: Prisma.ProductWhereInput): Promise<Product[] | string> {
        try {
            if (whereInput.id) {
                whereInput.id = { in: whereInput.id.toString().split(",") }
            }
            return this.prisma.product.findMany({ where: whereInput })
        } catch (err) {
            console.log("Error occured while fetching product list", err)
            return err.message
        }
    }

    async GetProductNOrders(whereInput: Prisma.ProductWhereInput): Promise<any> {
        try {
            const products = await this.prisma.product.findMany({ where: whereInput })
            let productIds = ''
            for (const product of products) {
                productIds = productIds.concat(product.id + ",")
            }
            const orderResp = await lastValueFrom(this.httpService.get(`http://localhost:3000/orders?productId=${productIds}`));
            const orderMap = new Map<string, any[]>()
            for (const order of orderResp.data.response) {
                if (orderMap.get(order.productId)) {
                    const value = orderMap.get(order.productId)
                    value.push(order)
                    orderMap.set(order.productId, value)
                } else {
                    orderMap.set(order.productId, [order])
                }
            }
            for (const product of products) {
                product["orders"] = orderMap.get(product.id) || []
            }
            return products
        } catch (err) {
            console.log("Error occured while fetching product and order data", err)
            return err.message
        }
    }
    async UpdateProduct(uniqueInput: Prisma.ProductWhereUniqueInput, updateInput: Prisma.ProductUpdateInput): Promise<Product | string | null> {
        try {
            return this.prisma.product.update({ where: uniqueInput, data: updateInput })
        } catch (err) {
            console.log("Error occured while updating the product data", err)
            return err.message
        }
    }

    async DeleteProduct(uniqueInput: Prisma.ProductWhereUniqueInput): Promise<any> {
        try {
            const orderResp = await lastValueFrom(this.httpService.get(`http://localhost:3000/orders?productId=${uniqueInput.id}`));

            let deletedProduct: any = { status: "Orders are placed for the product, so we cant delete the product now." }
            if (orderResp.data.response.length == 0) {
                deletedProduct = await this.prisma.product.delete({ where: uniqueInput })
            }
            return deletedProduct
        } catch (err) {
            console.log("Error occured while deleting the product", err)
            return err.message
        }
    }
}