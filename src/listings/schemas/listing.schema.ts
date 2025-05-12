// =========================
// listings/schemas/listing.schema.ts
// =========================
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true })
export class Listing extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  pricePerDay: number;

  @Prop([String])
  images: string[];

  @Prop()
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
