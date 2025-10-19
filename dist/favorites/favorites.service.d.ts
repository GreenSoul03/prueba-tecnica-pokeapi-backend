import { PrismaClient } from '@prisma/client';
import { PokemonService } from '../pokemon/pokemon.service';
export interface FavoriteDetailed {
    id: number;
    userId: number;
    pokemonId: number;
    createdAt: Date;
    pokemon: {
        id: number;
        name: string;
        types: string[];
        sprite: string;
        abilities: string[];
        stats: {
            name: string;
            base_stat: number;
        }[];
        isFavorite: boolean;
    };
}
export declare class FavoritesService {
    private prisma;
    private readonly pokemonService;
    constructor(prisma: PrismaClient, pokemonService: PokemonService);
    addFavorite(userId: number, pokemonId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        pokemonId: number;
    }>;
    getFavoritesDetailed(userId: number, page?: number, limit?: number, filterName?: string, filterType?: string, orderBy?: 'asc' | 'desc'): Promise<FavoriteDetailed[]>;
    getFavoritesIds(userId: number): Promise<number[]>;
    removeFavorite(userId: number, pokemonId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        pokemonId: number;
    }>;
}
