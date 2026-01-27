import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Thêm dòng này ngay bên dưới app tạo ra
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
