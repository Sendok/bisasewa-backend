// ====================
// auth/auth.service.ts
// ====================
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password: _password, ...result } = user.toObject() as User;
    return result;
  }

  async login(
    data: LoginDto,
  ): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    const user = await this.validateUser(data.email, data.password);
    const payload = {
      email: user.email,
      sub: user._id.toString(),
      // Add any additional claims you need in the JWT
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: user, // Return user data along with token
    };
  }

  async register(data: RegisterDto): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create new user
    const newUser = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    // Remove password from response
    const { password, ...result } = newUser.toObject();
    return result;
  }
}
