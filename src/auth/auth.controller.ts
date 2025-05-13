// ====================
// auth/auth.controller.ts
// ====================
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import { RegisterDto } from '../auth/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    await this.authService.validateUser(body.email, body.password);
    return this.authService.login(body);
  }
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
