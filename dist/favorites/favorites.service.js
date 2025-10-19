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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const pokemon_service_1 = require("../pokemon/pokemon.service");
let FavoritesService = class FavoritesService {
    prisma;
    pokemonService;
    constructor(prisma, pokemonService) {
        this.prisma = prisma;
        this.pokemonService = pokemonService;
    }
    async addFavorite(userId, pokemonId) {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            throw new common_1.NotFoundException(`Usuario ${userId} no existe`);
        }
        const exists = await this.prisma.favorite.findFirst({
            where: { userId, pokemonId },
        });
        if (exists) {
            throw new common_1.BadRequestException('Este Pokémon ya está en tus favoritos');
        }
        return this.prisma.favorite.create({ data: { userId, pokemonId } });
    }
    async getFavoritesDetailed(userId, page = 1, limit = 20, filterName, filterType, orderBy = 'desc') {
        const offset = (page - 1) * limit;
        const favorites = await this.prisma.favorite.findMany({
            where: { userId },
            orderBy: { createdAt: orderBy },
            skip: offset,
            take: limit,
        });
        let detailedFavorites = await Promise.all(favorites.map(async (f) => {
            const pokemon = await this.pokemonService.findOne(f.pokemonId, userId);
            return { ...f, pokemon };
        }));
        if (filterName) {
            detailedFavorites = detailedFavorites.filter((f) => f.pokemon.name.toLowerCase().includes(filterName.toLowerCase()));
        }
        if (filterType) {
            detailedFavorites = detailedFavorites.filter((f) => f.pokemon.types.includes(filterType.toLowerCase()));
        }
        return detailedFavorites;
    }
    async getFavoritesIds(userId) {
        const favorites = await this.prisma.favorite.findMany({
            where: { userId },
        });
        return favorites.map((f) => f.pokemonId);
    }
    async removeFavorite(userId, pokemonId) {
        const favorite = await this.prisma.favorite.findFirst({
            where: { userId, pokemonId },
        });
        if (!favorite) {
            throw new common_1.NotFoundException('Este Pokémon no está en tus favoritos');
        }
        await this.prisma.favorite.delete({ where: { id: favorite.id } });
        return favorite;
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PRISMA_CLIENT')),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => pokemon_service_1.PokemonService))),
    __metadata("design:paramtypes", [client_1.PrismaClient,
        pokemon_service_1.PokemonService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map