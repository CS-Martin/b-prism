import { WarehouseServiceLibService } from '@b-prism/warehouse-service-lib';
import { CreateWarehouseDto, UpdateWarehouseDto } from '@dto';
import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';

@ApiTags('Warehouse Endpoints')
@Controller('warehouse')
export class WarehouseController {
    constructor(private readonly warehouseServiceLibService: WarehouseServiceLibService) {}

    @Post('create')
    @UseGuards(AuthGuard)
    create(@Body() payload: { data: CreateWarehouseDto; author: string }) {
        const { data, author } = payload;

        return this.warehouseServiceLibService.create(data, author);
    }

    @Put('update/:id')
    @UseGuards(AuthGuard)
    update(@Param('id') id: string, @Body() payload: { data: UpdateWarehouseDto; author: string }) {
        const { data, author } = payload;
        return this.warehouseServiceLibService.update(id, data, author);
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard)
    delete(@Param('id') id: string, @Headers('X-Author') author: string) {
        return this.warehouseServiceLibService.delete(id, author);
    }

    @Get()
    findAll() {
        return this.warehouseServiceLibService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.warehouseServiceLibService.findById(id);
    }
}
