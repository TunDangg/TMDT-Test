import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Chỉ cho phép frontend trên cổng 5173 truy cập
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Cho phép tất cả các phương thức HTTP
    credentials: true, // Cho phép gửi cookie nếu cần
  });

  await app.listen(3000);
}
void bootstrap();
