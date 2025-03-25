import { RoleServiceLibService } from '@b-prism/role-service-lib';
import { CreateRoleDto, UpdateRoleDto } from '@dto';
import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';

@ApiTags('Role Endpoints')
// @UseGuards(AuthGuard)
@Controller(`${new ConfigService().get('API_VERSION')}/roles`)
export class RoleController {
    constructor(private readonly roleServiceLibService: RoleServiceLibService) {}

    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleServiceLibService.create(createRoleDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Headers('X-Author') author: string) {
        return this.roleServiceLibService.update(id, updateRoleDto, author);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Headers('X-Author') author: string) {
        return this.roleServiceLibService.delete(id, author);
    }

    @Get()
    findAll() {
        return this.roleServiceLibService.findAll();
    }

    @Get('search') // Now it will respond to /v1/roles/search?name=...
    findByName(@Query('name') name: string) {
        return this.roleServiceLibService.findByName(name);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.roleServiceLibService.findOne(id);
    }
}
