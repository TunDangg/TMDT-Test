import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './entities/users.service';

@Module({
  imports: [
    // Đăng ký entity User để NestJS tạo Repository tương ứng
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersService],
  exports: [UsersService], // Cho phép các module khác (như Auth) sử dụng UsersService
})
export class UsersModule {}
