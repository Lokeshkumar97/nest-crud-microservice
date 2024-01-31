import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000,function (){
    console.log("server is running at ",3000);
  });
}
bootstrap();
