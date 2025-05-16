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

  async getAllCategories() {
    return this.listingModel.distinct('category');
  }

  async search(filters: {
    query?: string;
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const {
      query,
      category,
      location,
      minPrice,
      maxPrice,
      available,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    interface SearchConditions {
      category?: string;
      location?: RegExp;
      isAvailable?: boolean;
      pricePerDay?: { $gte?: number; $lte?: number };
      $or?: { [key: string]: RegExp }[];
    }

    const conditions: SearchConditions = {};

    if (query) {
      conditions.$or = [
        { title: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
      ];
    }

    if (category) conditions.category = category;
    if (location) conditions.location = new RegExp(location, 'i');
    if (typeof available === 'boolean') conditions.isAvailable = available;

    if (minPrice !== undefined || maxPrice !== undefined) {
      conditions.pricePerDay = {};
      if (minPrice !== undefined) conditions.pricePerDay.$gte = minPrice;
      if (maxPrice !== undefined) conditions.pricePerDay.$lte = maxPrice;
    }

    const skip = (page - 1) * limit;
    const sortOrderValue = sortOrder === 'asc' ? 1 : -1;

    const [items, totalItems] = await Promise.all([
      this.listingModel
        .find(conditions)
        .sort({ [sortBy]: sortOrderValue })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.listingModel.countDocuments(conditions).exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    };
  }
}
