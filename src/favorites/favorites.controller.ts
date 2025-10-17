import { Controller, Post, Get, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Favoritos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: 'Agregar un Pokémon a favoritos' })
  @ApiParam({ name: 'pokemonId', type: Number, description: 'ID del Pokémon a agregar' })
  @ApiResponse({ status: 201, description: 'Favorito agregado correctamente' })
  @Post(':pokemonId')
  addFavorite(@Req() req, @Param('pokemonId') pokemonId: string) {
    const userId = req.user.sub;
    return this.favoritesService.addFavorite(userId, Number(pokemonId));
  }

  @ApiOperation({ summary: 'Listar todos los Pokémon favoritos del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de favoritos devuelta correctamente' })
  @Get()
  getFavorites(@Req() req) {
    const userId = req.user.sub;
    return this.favoritesService.getFavorites(userId);
  }

  @ApiOperation({ summary: 'Eliminar un Pokémon de los favoritos' })
  @ApiParam({ name: 'pokemonId', type: Number, description: 'ID del Pokémon a eliminar' })
  @ApiResponse({ status: 200, description: 'Favorito eliminado correctamente' })
  @Delete(':pokemonId')
  removeFavorite(@Req() req, @Param('pokemonId') pokemonId: string) {
    const userId = req.user.sub;
    return this.favoritesService.removeFavorite(userId, Number(pokemonId));
  }
}
