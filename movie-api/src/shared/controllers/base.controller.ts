import { BaseService } from '../services/base.service';
import { BaseEntity } from '../entities/base.entity';
import {
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export class BaseController<T extends BaseEntity> {
  constructor(private readonly baseService: BaseService<T>) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'Return all items.' })
  async findAll(): Promise<T[]> {
    return this.baseService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get item by id' })
  @ApiResponse({ status: 200, description: 'Return item by id.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<T> {
    return this.baseService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create item' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created.'
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() entity: any): Promise<T> {
    return this.baseService.create(entity);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, description: 'The item has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() entity: any,
  ): Promise<T> {
    return this.baseService.update(id, entity);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete item' })
  @ApiResponse({ status: 204, description: 'The item has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.baseService.remove(id);
  }
}
