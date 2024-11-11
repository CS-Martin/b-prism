import { DispensingPointServiceLibService } from '@b-prism/dispensing-point-service-lib';
import { CreateDispensingPointDto } from '@dto';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Dispensing Point Endpoints')
@Controller('dispensing-point')
export class DispensingPointController {
    constructor(private readonly dispensingPointServiceLibService: DispensingPointServiceLibService) {}

    @Post('create')
    create(@Body() createDispensingPointDto: CreateDispensingPointDto) {
        return this.dispensingPointServiceLibService.create(createDispensingPointDto);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: string) {
        return this.dispensingPointServiceLibService.delete(id);
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
