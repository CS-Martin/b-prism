import { WarehouseServiceLibService } from '@b-prism/warehouse-service-lib';
import { CreateWarehouseDto, UpdateWarehouseDto } from '@dto';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Warehouse Endpoints')
@Controller('warehouse')
export class WarehouseController {
    constructor(private readonly warehouseServiceLibService: WarehouseServiceLibService) {}

    @Post('create')
    create(@Body() createWarehouseDto: CreateWarehouseDto) {
        return this.warehouseServiceLibService.create(createWarehouseDto);
    }

    @Put('update/:id')
    update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
        return this.warehouseServiceLibService.update(id, updateWarehouseDto);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: string) {
        return this.warehouseServiceLibService.delete(id);
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
