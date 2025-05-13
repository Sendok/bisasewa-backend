// ====================
// listings/listings.service.ts
// ====================
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing } from './schemas/listing.schema';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<Listing>,
  ) {}

  async create(data: Partial<Listing>): Promise<Listing> {
    const created = new this.listingModel(data);
    return created.save();
  }

  async findAll(): Promise<Listing[]> {
    return this.listingModel.find().populate('owner').exec();
  }

  async findById(id: string): Promise<Listing | null> {
    return this.listingModel.findById(id).populate('owner').exec();
  }

  async update(id: string, data: Partial<Listing>): Promise<Listing | null> {
    return this.listingModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Listing | null> {
    return this.listingModel.findByIdAndDelete(id).exec();
  }
}
