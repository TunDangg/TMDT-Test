import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'EDTEXCO_SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
