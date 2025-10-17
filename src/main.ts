import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';

async function bootstrap() {
  // Crear la app con logger personalizado
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });

  // ==============================
  // Configuración Swagger con Basic Auth
  // ==============================
  app.use(
    ['/docs', '/docs-json'], // rutas de Swagger protegidas
    basicAuth({
      challenge: true,
      users: { admin: 'kitkaton123' }, // usuario y contraseña
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('PokeAPI NestJS')
    .setDescription('API REST de Pokémon con favoritos')
    .setVersion('1.0')
    .addBearerAuth() // para JWT en Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // ==============================
  // Inicio de la app
  // ==============================
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

// Manejo global de errores al iniciar
bootstrap().catch((err) => {
  console.error('Error starting the app:', err);
});
