// ====================
// auth/schemas/email-verification.schema.ts
// ====================
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, expires: 3600 })
export class EmailVerification extends Document {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  token: string;
  @Prop({ default: Date.now, expires: 43200 }) // Expires in 12 hours
  createdAt: Date;
}

// eslint-disable-next-line prettier/prettier
export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);
