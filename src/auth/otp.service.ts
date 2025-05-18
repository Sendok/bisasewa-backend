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
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes expiry

    await this.otpModel.create({
      phone: dto.phone,
      code,
      expiresAt,
    });

    // In production, integrate with SMS service here
    console.log(`OTP for ${dto.phone}: ${code}`);

    return {
      message: 'OTP sent successfully',
      phone: dto.phone,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otp = await this.otpModel.findOne({
      phone: dto.phone,
      code: dto.code,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Delete used OTP
    await this.otpModel.deleteOne({ _id: otp._id });

    return {
      message: 'OTP verified successfully',
      phone: dto.phone,
    };
  }
}
