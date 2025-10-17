import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });
  await app.listen(process.env.PORT ?? 3002);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3002}`,
  );
}
bootstrap().catch((err) => {
  console.error('Error starting the app:', err);
});
