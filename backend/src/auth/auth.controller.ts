import { Get, Request, Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/entities/users.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth') // Đường dẫn gốc sẽ là localhost:3000/auth
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('profile') // Đường dẫn sẽ là localhost:3000/auth/profile
  getProfile(@Request() req) {
    return this.usersService.findProfile(req.user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login') // Đường dẫn sẽ là localhost:3000/auth/login
  async login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.username, loginDto.password);
  }

  @Post('register') // Đường dẫn sẽ là localhost:3000/auth/register
  async register(@Body() registerDto: RegisterDto) {
    return this.usersService.create(registerDto.username, registerDto.password);
  }
}
