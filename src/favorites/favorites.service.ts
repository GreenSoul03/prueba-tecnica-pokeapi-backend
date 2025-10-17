import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaClient) {}

  async addFavorite(userId: number, pokemonId: number) {
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
    throw new Error(`Usuario ${userId} no existe en la BD`);
    }

  return this.prisma.favorite.create({
    data: { userId, pokemonId },
  });
}

  async getFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeFavorite(userId: number, pokemonId: number) {
    const favorite = await this.prisma.favorite.findFirst({
      where: { userId, pokemonId },
    });

    if (!favorite) {
      throw new NotFoundException('Este Pokémon no está en tus favoritos');
    }

    await this.prisma.favorite.delete({ where: { id: favorite.id } });

    return { message: 'Favorito eliminado correctamente' };
  }
}
