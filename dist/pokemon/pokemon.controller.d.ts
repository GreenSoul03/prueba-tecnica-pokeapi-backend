import { PokemonService, Pokemon } from './pokemon.service';
import { Request } from 'express';
interface JwtPayload {
    sub: number;
    email: string;
}
interface RequestWithUser extends Request {
    user?: JwtPayload;
}
export declare class PokemonController {
    private readonly pokemonService;
    constructor(pokemonService: PokemonService);
    findAll(req: RequestWithUser, name?: string, page?: string): Promise<{
        page: number;
        limit: number;
        results: Pokemon[];
    }>;
    findOne(id: string, req: RequestWithUser): Promise<Pokemon>;
}
export {};
