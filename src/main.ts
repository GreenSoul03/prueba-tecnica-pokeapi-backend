import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  //==============================
  // Crear la app con logger personalizado
  //==============================
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });

  // ==============================
  // Leer configuración desde .env y variables del entorno
  // ==============================
  const configService = app.get(ConfigService);

  const swaggerUser = configService.get<string>('BASIC_AUTH_USER');
  const swaggerPass = configService.get<string>('BASIC_AUTH_PASSWORD');

  // AWS Elastic Beanstalk usa process.env.PORT
  const port = process.env.PORT || configService.get<number>('PORT') || 8080;

  if (!swaggerUser || !swaggerPass) {
    throw new Error(
      'BASIC_AUTH_USER y BASIC_AUTH_PASSWORD deben estar definidos en el entorno',
    );
  }

  //==============================
  // Crear objeto users para Basic Auth
  //==============================
  const users: Record<string, string> = {};
  users[swaggerUser] = swaggerPass;

  // ==============================
  // Configuración Swagger con Basic Auth
  // ==============================
  app.use(['/docs', '/docs-json'], basicAuth({ challenge: true, users }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PokeAPI NestJS')
    .setDescription('API REST de Pokémon con favoritos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // ==============================
  // Inicio de la app
  // ==============================
  await app.listen(port, '0.0.0.0'); // <- importante en AWS
  console.log(`Application is running on port ${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

//==============================
// Manejo global de errores al iniciar
//==============================
bootstrap().catch((err) => {
  console.error('❌ Error starting the app:', err);
});
