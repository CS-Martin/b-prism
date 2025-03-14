import { DispensingPointServiceLibService } from '@b-prism/dispensing-point-service-lib';
import { CreateDispensingPointDto, UpdateDispensingPointDto } from '@dto';
import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Dispensing Point Endpoints')
@Controller(`${new ConfigService().get('API_VERSION')}/dispensing-points`)
export class DispensingPointController {
    constructor(private readonly dispensingPointServiceLibService: DispensingPointServiceLibService) {}

    @Post()
    create(@Body() payload: { data: CreateDispensingPointDto; author: string }) {
        const { data, author } = payload;

        return this.dispensingPointServiceLibService.create(data, author);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() payload: { data: UpdateDispensingPointDto; author: string }) {
        const { data, author } = payload;

        return this.dispensingPointServiceLibService.update(id, data, author);
    }

    @Delete(':id')
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
