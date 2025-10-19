import { FavoritesService } from '../favorites/favorites.service';
export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprite: string;
    types: string[];
    abilities?: string[];
    stats?: {
        name: string;
        base_stat: number;
    }[];
    isFavorite?: boolean;
}
export declare class PokemonService {
    private readonly favoritesService;
    private readonly client;
    private readonly limit;
    constructor(favoritesService: FavoritesService);
    findAll(name?: string, page?: number, userId?: number): Promise<{
        page: number;
        limit: number;
        results: Pokemon[];
    }>;
    findOne(id: number, userId?: number): Promise<Pokemon>;
}
