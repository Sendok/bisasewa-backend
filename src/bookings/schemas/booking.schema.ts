// ==========================
// bookings/schemas/booking.schema.ts
// ==========================
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Listing } from '../../listings/schemas/listing.schema';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Listing' })
  listing: Listing;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  renter: User;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
