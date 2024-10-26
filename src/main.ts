import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { CustomFilter } from './exception/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await mongoose.connect(`${process.env.DB_URL}`);
app.enableCors();
app.useGlobalFilters(new CustomFilter());
  await app.listen(process.env.PORT ?? 3000);
  console.log('the app is listening on port ', process.env.PORT);
}
bootstrap();
