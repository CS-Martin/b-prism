import { WarehouseServiceLibService } from '@b-prism/warehouse-service-lib';
import { CreateWarehouseDto } from '@dto';
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Warehouse Endpoints')
@Controller('warehouse')
export class WarehouseController {
    constructor(private readonly warehouseServiceLibService: WarehouseServiceLibService) {}

    @Post('create')
    create(@Body() createWarehouseDto: CreateWarehouseDto) {
        return this.warehouseServiceLibService.create(createWarehouseDto);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: string) {
        return this.warehouseServiceLibService.delete(id);
    }
}
