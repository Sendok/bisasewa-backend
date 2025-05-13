// ====================
// bookings/bookings.controller.ts
// ====================
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './schemas/booking.schema';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() data: Partial<Booking>) {
    return this.bookingsService.create(data);
  }

  @Get()
  async findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Booking>) {
    return this.bookingsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bookingsService.delete(id);
  }
}
