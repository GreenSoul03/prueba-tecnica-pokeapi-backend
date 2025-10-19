import { FavoritesService, FavoriteDetailed } from './favorites.service';
import { Request } from 'express';
interface JwtPayload {
    sub: number;
    email: string;
}
interface RequestWithUser extends Request {
    user: JwtPayload;
}
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    addFavorite(req: RequestWithUser, pokemonId: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        pokemonId: number;
    }>;
    getFavorites(req: RequestWithUser, page?: string, limit?: string, filterName?: string, filterType?: string, orderBy?: 'asc' | 'desc'): Promise<FavoriteDetailed[]>;
    removeFavorite(req: RequestWithUser, pokemonId: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        pokemonId: number;
    }>;
}
export {};
