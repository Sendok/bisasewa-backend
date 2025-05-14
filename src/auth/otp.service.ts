// ====================
// auth/otp.service.ts
// ====================
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP } from './schemas/otp.schema';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class OtpService {
  constructor(@InjectModel(OTP.name) private otpModel: Model<OTP>) {}

  async requestOtp(dto: RequestOtpDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 menit

    await this.otpModel.create({ phone: dto.phone, code, expiresAt });

    // Kirim SMS disini (mock/3rd-party)
    console.log(`OTP for ${dto.phone} is ${code}`);

    return { message: 'OTP sent' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const record = await this.otpModel.findOne({
      phone: dto.phone,
      code: dto.code,
    });
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP invalid or expired');
    }
    await this.otpModel.deleteMany({ phone: dto.phone });
    return { message: 'OTP verified' };
  }
}
