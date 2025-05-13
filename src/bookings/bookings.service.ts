// ====================
// bookings/bookings.service.ts
// ====================
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './schemas/booking.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async create(data: Partial<Booking>): Promise<Booking> {
    return new this.bookingModel(data).save();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().populate('listing renter').exec();
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).populate('listing renter').exec();
  }

  async update(id: string, data: Partial<Booking>): Promise<Booking | null> {
    return this.bookingModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Booking | null> {
    return this.bookingModel.findByIdAndDelete(id).exec();
  }
}
