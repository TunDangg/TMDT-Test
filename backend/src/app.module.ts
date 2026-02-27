// File module này phụ trách kết nối với database và các dbcon
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './users/entities/user.entity'; // import entity User vào đây để TypeOrm biết
import { Product } from './products/entities/product.entity'; // import entity Product vào đây để TypeOrm biết
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CartItem } from './cart/entities/cart-item.entity'; // import module User vào đây để nest biết

@Module({
  imports: [
    ConfigModule.forRoot(), // Đọc file .env
    TypeOrmModule.forRoot({
      // Bắt tay với database
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true, // Tự động nạp Product Entity ( chưa hiểu để làm gì )
      synchronize: true, // để false vì đã đã tạo bảng trong DataGrip rồi
      entities: [Product, User, CartItem], // Đăng ký các entity với TypeOrm
    }),
    UsersModule,
    ProductsModule, // module này ở đây để nest biết có chức năng qly spham
    AuthModule, // module này ở đây để nest biết có chức năng xác thực ng dùng
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
