// ====================
// auth/schemas/auth.schema.ts (Opsional jika kamu simpan session/token)
// ====================
// Auth biasanya tidak butuh schema sendiri, hanya login/signup service

// ====================
// auth/auth.module.ts
// ====================
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { OTP, OTPSchema } from './schemas/otp.schema';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret123',
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }]),
  ],
  providers: [AuthService, JwtStrategy, OtpService],
  controllers: [AuthController, OtpController],
})
export class AuthModule {}
