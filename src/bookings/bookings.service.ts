import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './schemas/booking.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}

  async create(data: Partial<Booking>) {
    return new this.bookingModel(data).save();
  }

  async findAllByUser(userId: string) {
    return this.bookingModel
      .find({ renter: userId })
      .populate('listing')
      .exec();
  }

  async findById(id: string) {
    return this.bookingModel.findById(id).populate('listing renter').exec();
  }

  async cancel(id: string) {
    return this.bookingModel.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true },
    );
  }

  processPayment(id: string, paymentInfo: any) {
    // Integrasi payment gateway di sini (dummy)
    return {
      success: true,
      bookingId: id,
      message: `Payment processed (mock) with info: ${JSON.stringify(paymentInfo)}`,
    };
  }
}
