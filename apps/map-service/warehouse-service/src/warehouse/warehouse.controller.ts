import { Post } from '@nestjs/common';

export class WarehouseController {
    @Post('create')
    create(@Body() createWarehouseDto: CreateWarehouseDto) {
        return this.warehouseService.create(createWarehouseDto);
    }
}
