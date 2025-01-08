import { DispensingPointServiceLibService } from '@b-prism/dispensing-point-service-lib';
import { CreateDispensingPointDto, UpdateDispensingPointDto } from '@dto';
import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Dispensing Point Endpoints')
@Controller('dispensing-point')
export class DispensingPointController {
    constructor(private readonly dispensingPointServiceLibService: DispensingPointServiceLibService) {}

    @Post('create')
    create(@Body() payload: { data: CreateDispensingPointDto; author: string }) {
        const { data, author } = payload;

        return this.dispensingPointServiceLibService.create(data, author);
    }

    @Put('update/:id')
    update(@Param('id') @Body() payload: { id: string; data: UpdateDispensingPointDto; author: string }) {
        const { id, data, author } = payload;

        return this.dispensingPointServiceLibService.update(id, data, author);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: string, @Headers('X-Author') author: string) {
        return this.dispensingPointServiceLibService.delete(id, author);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.dispensingPointServiceLibService.findById(id);
    }

    @Get()
    findAll() {
        return this.dispensingPointServiceLibService.findAll();
    }
}
