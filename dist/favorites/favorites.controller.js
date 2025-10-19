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
exports.FavoritesController = void 0;
const common_1 = require("@nestjs/common");
const favorites_service_1 = require("./favorites.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let FavoritesController = class FavoritesController {
    favoritesService;
    constructor(favoritesService) {
        this.favoritesService = favoritesService;
    }
    addFavorite(req, pokemonId) {
        const userId = req.user.sub;
        return this.favoritesService.addFavorite(userId, Number(pokemonId));
    }
    getFavorites(req, page, limit, filterName, filterType, orderBy) {
        const userId = req.user.sub;
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 20;
        return this.favoritesService.getFavoritesDetailed(userId, pageNum, limitNum, filterName, filterType, orderBy);
    }
    removeFavorite(req, pokemonId) {
        const userId = req.user.sub;
        return this.favoritesService.removeFavorite(userId, Number(pokemonId));
    }
};
exports.FavoritesController = FavoritesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Agregar un Pokémon a favoritos' }),
    (0, swagger_1.ApiParam)({
        name: 'pokemonId',
        type: Number,
        description: 'ID del Pokémon a agregar',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Favorito agregado correctamente',
    }),
    (0, common_1.Post)(':pokemonId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('pokemonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "addFavorite", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Listar todos los Pokémon favoritos del usuario con info detallada',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Número de página',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Cantidad por página',
        example: 20,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'filterName',
        required: false,
        description: 'Filtra por nombre de Pokémon',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'filterType',
        required: false,
        description: 'Filtra por tipo de Pokémon',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'orderBy',
        required: false,
        description: 'Ordenar por fecha',
        example: 'desc',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de favoritos devuelta correctamente',
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('filterName')),
    __param(4, (0, common_1.Query)('filterType')),
    __param(5, (0, common_1.Query)('orderBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "getFavorites", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un Pokémon de los favoritos' }),
    (0, swagger_1.ApiParam)({
        name: 'pokemonId',
        type: Number,
        description: 'ID del Pokémon a eliminar',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Favorito eliminado correctamente',
    }),
    (0, common_1.Delete)(':pokemonId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('pokemonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FavoritesController.prototype, "removeFavorite", null);
exports.FavoritesController = FavoritesController = __decorate([
    (0, swagger_1.ApiTags)('Favoritos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/v1/favorites'),
    __metadata("design:paramtypes", [favorites_service_1.FavoritesService])
], FavoritesController);
//# sourceMappingURL=favorites.controller.js.map