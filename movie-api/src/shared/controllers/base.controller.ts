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
  Logger,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

export class BaseController<T extends BaseEntity> {
  protected readonly logger = new Logger(this.constructor.name, { timestamp: true });
  
  constructor(private readonly baseService: BaseService<T>) {
    this.logger.log('Initializing controller');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'Return all items.' })
  async findAll(): Promise<T[]> {
    this.logger.log('Fetching all items');
    try {
      const items = await this.baseService.findAll();
      this.logger.log(`Successfully fetched ${items.length} items`);
      return items;
    } catch (error) {
      this.logger.error(`Failed to fetch items: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch items');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get item by id' })
  @ApiResponse({ status: 200, description: 'Return item by id.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<T> {
    this.logger.log(`Fetching item with id: ${id}`);
    try {
      const item = await this.baseService.findOne(id);
      if (!item) {
        this.logger.warn(`Item not found with id: ${id}`);
        throw new NotFoundException(`Item with id ${id} not found`);
      }
      this.logger.log(`Successfully fetched item with id: ${id}`);
      return item;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch item with id ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch item');
    }
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
    this.logger.log('Creating new item');
    try {
      const createdItem = await this.baseService.create(entity);
      this.logger.log(`Successfully created item with id: ${createdItem.id}`);
      return createdItem;
    } catch (error) {
      this.logger.error(`Failed to create item: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create item');
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, description: 'The item has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() entity: any,
  ): Promise<T> {
    this.logger.log(`Updating item with id: ${id}`);
    try {
      const updatedItem = await this.baseService.update(id, entity);
      if (!updatedItem) {
        this.logger.warn(`Item not found for update with id: ${id}`);
        throw new NotFoundException(`Item with id ${id} not found`);
      }
      this.logger.log(`Successfully updated item with id: ${id}`);
      return updatedItem;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update item with id ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to update item');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete item' })
  @ApiResponse({ status: 204, description: 'The item has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
    this.logger.log(`Deleting item with id: ${id}`);
    try {
      await this.baseService.remove(id);
      this.logger.log(`Successfully deleted item with id: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Item not found for deletion with id: ${id}`);
        throw error;
      }
      this.logger.error(`Failed to delete item with id ${id}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete item');
    }
  }
}
