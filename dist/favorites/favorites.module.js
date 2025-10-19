"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesModule = void 0;
const common_1 = require("@nestjs/common");
const favorites_service_1 = require("./favorites.service");
const favorites_controller_1 = require("./favorites.controller");
const client_1 = require("@prisma/client");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("../auth/strategies/jwt.strategy");
const pokemon_module_1 = require("../pokemon/pokemon.module");
let FavoritesModule = class FavoritesModule {
};
exports.FavoritesModule = FavoritesModule;
exports.FavoritesModule = FavoritesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1h' },
            }),
            (0, common_1.forwardRef)(() => pokemon_module_1.PokemonModule),
        ],
        controllers: [favorites_controller_1.FavoritesController],
        providers: [favorites_service_1.FavoritesService, client_1.PrismaClient, jwt_strategy_1.JwtStrategy],
        exports: [favorites_service_1.FavoritesService],
    })
], FavoritesModule);
//# sourceMappingURL=favorites.module.js.map