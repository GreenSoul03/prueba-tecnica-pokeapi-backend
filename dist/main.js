"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'debug'],
    });
    const configService = app.get(config_1.ConfigService);
    const swaggerUser = configService.get('BASIC_AUTH_USER');
    const swaggerPass = configService.get('BASIC_AUTH_PASSWORD');
    const port = process.env.PORT || configService.get('PORT') || 8080;
    if (!swaggerUser || !swaggerPass) {
        throw new Error('BASIC_AUTH_USER y BASIC_AUTH_PASSWORD deben estar definidos en el entorno');
    }
    const users = {};
    users[swaggerUser] = swaggerPass;
    app.use(['/docs', '/docs-json'], (0, express_basic_auth_1.default)({ challenge: true, users }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('PokeAPI NestJS')
        .setDescription('API REST de Pokémon con favoritos')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on port ${port}`);
    console.log(`Swagger docs: http://localhost:${port}/docs`);
}
bootstrap().catch((err) => {
    console.error('❌ Error starting the app:', err);
});
//# sourceMappingURL=main.js.map