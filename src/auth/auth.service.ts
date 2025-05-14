// ====================
// auth/auth.service.ts
// ====================
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { EmailVerification } from './schemas/email-verification.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(EmailVerification.name)
    private emailVerificationModel: Model<EmailVerification>,
  ) {}
  async verifyEmail(token: string): Promise<any> {
    const verification = await this.emailVerificationModel.findOne({ token });
    if (!verification) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.userModel.findOneAndUpdate(
      { email: verification.email },
      { isVerified: true },
    );

    await this.emailVerificationModel.deleteOne({ token });
    return { message: 'Email verified successfully' };
  }
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject() as Record<string, any>;
      return result;
    }
    return null;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new BadRequestException('Email already used');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      ...dto,
      password: hashed,
      isVerified: false,
    });

    const token = randomBytes(20).toString('hex');
    await this.emailVerificationModel.create({ email: user.email, token });

    console.log(`Verify email (mock): /auth/verify-email?token=${token}`);
    return { message: 'Registration successful, verify your email (mock)' };
  }
  async resendVerificationEmail(email: string) {
    const user = await this.userModel.findOne({ email, isVerified: false });
    if (!user) {
      throw new BadRequestException('User not found or already verified');
    }
    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }
    const token = randomBytes(20).toString('hex');
    await this.emailVerificationModel.findOneAndUpdate(
      { email: user.email },
      { token },
      { upsert: true },
    );
    console.log(`Verify email (mock): /auth/verify-email?token=${token}`);
    return { message: 'Verification email resent (mock)' };
  }
}
