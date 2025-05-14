// ====================
// listings/listings.controller.ts
// ====================
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Listing } from './schemas/listing.schema';
import { Query as NestQuery } from '@nestjs/common';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  async create(@Body() data: Partial<Listing>) {
    return this.listingsService.create(data);
  }

  @Get()
  async findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.listingsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Listing>) {
    return this.listingsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.listingsService.delete(id);
  }

  @Get('search')
  async searchListings(
    @Query('q') query: string,
    @Query('category') category: string,
  ) {
    return this.listingsService.search(query, category);
  }

  @Get('categories')
  async listCategories() {
    return this.listingsService.getAllCategories();
  }
}
function Query(paramName: string) {
  return NestQuery(paramName);
}
