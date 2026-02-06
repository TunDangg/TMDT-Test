import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Bắt buộc phải có dòng này
  //forFeature giúp giới hạn rằng module này chỉ được phép thao tác với những Entity nào được khai báo
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
