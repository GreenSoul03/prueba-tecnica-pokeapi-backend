"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonController = void 0;
const common_1 = require("@nestjs/common");
const pokemon_service_1 = require("./pokemon.service");
const optional_jwt_guard_1 = require("../auth/guards/optional-jwt.guard");
const swagger_1 = require("@nestjs/swagger");
let PokemonController = class PokemonController {
    pokemonService;
    constructor(pokemonService) {
        this.pokemonService = pokemonService;
    }
    async findAll(req, name, page) {
        const pageNum = page ? parseInt(page) : 1;
        const userId = req.user?.sub;
        return this.pokemonService.findAll(name || '', pageNum, userId);
    }
    async findOne(id, req) {
        const userId = req.user?.sub;
        return this.pokemonService.findOne(Number(id), userId);
    }
};
exports.PokemonController = PokemonController;
__decorate([
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar Pokémon paginados con opción de favoritos' }),
    (0, swagger_1.ApiQuery)({
        name: 'name',
        required: false,
        description: 'Nombre parcial para filtrar Pokémon',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Número de página (paginación)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de Pokémon devuelta correctamente',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PokemonController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(optional_jwt_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener detalles de un Pokémon por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del Pokémon' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Detalles del Pokémon devueltos correctamente',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PokemonController.prototype, "findOne", null);
exports.PokemonController = PokemonController = __decorate([
    (0, swagger_1.ApiTags)('Pokémon'),
    (0, common_1.Controller)('api/v1/pokemon'),
    __metadata("design:paramtypes", [pokemon_service_1.PokemonService])
], PokemonController);
//# sourceMappingURL=pokemon.controller.js.map