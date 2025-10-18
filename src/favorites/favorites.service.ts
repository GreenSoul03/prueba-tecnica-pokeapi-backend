import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
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
    stats: { name: string; base_stat: number }[];
    isFavorite: boolean;
  };
}

@Injectable()
export class FavoritesService {
  constructor(
    @Inject('PRISMA_CLIENT') 
    private prisma: PrismaClient,

    @Inject(forwardRef(() => PokemonService))
    private readonly pokemonService: PokemonService,
  ) {}

  async addFavorite(userId: number, pokemonId: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`Usuario ${userId} no existe`);
    }

    const exists = await this.prisma.favorite.findFirst({
      where: { userId, pokemonId },
    });

    if (exists) {
      throw new BadRequestException('Este Pokémon ya está en tus favoritos');
    }

    return this.prisma.favorite.create({ data: { userId, pokemonId } });
  }

  async getFavoritesDetailed(
    userId: number,
    page = 1,
    limit = 20,
    filterName?: string,
    filterType?: string,
    orderBy: 'asc' | 'desc' = 'desc',
  ): Promise<FavoriteDetailed[]> {
    const offset = (page - 1) * limit;

    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: orderBy },
      skip: offset,
      take: limit,
    });

    let detailedFavorites: FavoriteDetailed[] = await Promise.all(
      favorites.map(async (f) => {
        const pokemon = await this.pokemonService.findOne(f.pokemonId, userId);
        return { ...f, pokemon } as FavoriteDetailed;
      }),
    );

    if (filterName) {
      detailedFavorites = detailedFavorites.filter((f) =>
        f.pokemon.name.toLowerCase().includes(filterName.toLowerCase()),
      );
    }

    if (filterType) {
      detailedFavorites = detailedFavorites.filter((f) =>
        f.pokemon.types.includes(filterType.toLowerCase()),
      );
    }

    return detailedFavorites;
  }

  async getFavoritesIds(userId: number): Promise<number[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
    });

    return favorites.map((f) => f.pokemonId);
  }

  async removeFavorite(userId: number, pokemonId: number) {
    const favorite = await this.prisma.favorite.findFirst({
      where: { userId, pokemonId },
    });

    if (!favorite) {
      throw new NotFoundException('Este Pokémon no está en tus favoritos');
    }

    await this.prisma.favorite.delete({ where: { id: favorite.id } });

    return favorite;
  }
}
