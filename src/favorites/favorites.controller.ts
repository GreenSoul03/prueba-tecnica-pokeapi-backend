import { Controller, Post, Get, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':pokemonId')
  addFavorite(@Req() req, @Param('pokemonId') pokemonId: string) {
    const userId = req.user.sub;
    return this.favoritesService.addFavorite(userId, Number(pokemonId));
  }

  @Get()
  getFavorites(@Req() req) {
    console.log('Usuario autenticado:', req.user);
    const userId = req.user.sub;
    return this.favoritesService.getFavorites(userId);
  }

  @Delete(':pokemonId')
  removeFavorite(@Req() req, @Param('pokemonId') pokemonId: string) {
    const userId = req.user.sub;
    return this.favoritesService.removeFavorite(userId, Number(pokemonId));
  }
}
