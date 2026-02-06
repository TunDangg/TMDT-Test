// File module này phụ trách kết nối với database và các dbcon
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import {AppController} from "./app.controller";
import {AppService} from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot(), // Đọc file .env
    TypeOrmModule.forRoot({ // Bắt tay với database
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true, // Tự động nạp Product Entity ( chưa hiểu để làm gì )
      synchronize: false, // để false vì đã đã tạo bảng trong DataGrip rồi
    }),
    ProductsModule, // module này ở đây để nest biết có chức năng qly spham

  ],
  controllers:[AppController],
  providers:[AppService],



})
export class AppModule {}
