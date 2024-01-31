import { Controller, Post, Get, Put, Delete, Body, Param, Query, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductData } from './product.dto';
import { Product, Prisma } from '@prisma/client';

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post('create')
    async create(@Body(new ValidationPipe()) reqBody: ProductData): Promise<any> {
        const result = await this.productService.CreateProduct(reqBody)
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
    async getProduct(@Param('id') id: string): Promise<any> {
        const result = await this.productService.GetProduct({ id: id })
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
    async getProducts(@Query() queryParams: Prisma.ProductWhereInput): Promise<any> {
        const result = await this.productService.GetProducts(queryParams)
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
 
    @Get('productNorders')
    async getProductNOrders(@Query() queryParams: Prisma.ProductWhereInput): Promise<any> {
        const result = await this.productService.GetProductNOrders(queryParams)
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
    async updateProduct(@Param('id') id: string, @Body() reqBody: ProductData): Promise<any> {
        const result = await this.productService.UpdateProduct({ id: id }, reqBody)
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
    async deletePost(@Param('id') id: string): Promise<Product | any> {
        const result = await this.productService.DeleteProduct({ id: id })
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
