import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Listing } from '../../listings/schemas/listing.schema';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listing: Listing;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  renter: User;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 'pending' }) // pending, confirmed, cancelled
  status: string;

  @Prop()
  totalPrice: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
