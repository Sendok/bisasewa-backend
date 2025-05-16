import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { Listing } from './schemas/listing.schema';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  async create(@Body() data: Partial<Listing>) {
    return this.listingsService.create(data);
  }

  @Get('categories')
  async listCategories() {
    return this.listingsService.getAllCategories();
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
    @Query('q') query?: string,
    @Query('category') category?: string,
    @Query('location') location?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('available') available?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortOrder') sortOrder: string = 'desc',
  ) {
    return this.listingsService.search({
      query,
      category,
      location,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      available: available === 'true',
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
    });
  }
}
