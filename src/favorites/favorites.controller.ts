import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FavoritesService, FavoriteDetailed } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  email: string;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@ApiTags('Favoritos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: 'Agregar un Pokémon a favoritos' })
  @ApiParam({
    name: 'pokemonId',
    type: Number,
    description: 'ID del Pokémon a agregar',
  })
  @ApiResponse({
    status: 201,
    description: 'Favorito agregado correctamente',
  })
  @Post(':pokemonId')
  addFavorite(
    @Req() req: RequestWithUser,
    @Param('pokemonId') pokemonId: string,
  ) {
    const userId = req.user.sub;
    return this.favoritesService.addFavorite(userId, Number(pokemonId));
  }

  @ApiOperation({
    summary:
      'Listar todos los Pokémon favoritos del usuario con info detallada',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad por página',
    example: 20,
  })
  @ApiQuery({
    name: 'filterName',
    required: false,
    description: 'Filtra por nombre de Pokémon',
  })
  @ApiQuery({
    name: 'filterType',
    required: false,
    description: 'Filtra por tipo de Pokémon',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'Ordenar por fecha',
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de favoritos devuelta correctamente',
  })
  @Get()
  getFavorites(
    @Req() req: RequestWithUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('filterName') filterName?: string,
    @Query('filterType') filterType?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ): Promise<FavoriteDetailed[]> {
    const userId = req.user.sub;
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    return this.favoritesService.getFavoritesDetailed(
      userId,
      pageNum,
      limitNum,
      filterName,
      filterType,
      orderBy,
    );
  }

  @ApiOperation({ summary: 'Eliminar un Pokémon de los favoritos' })
  @ApiParam({
    name: 'pokemonId',
    type: Number,
    description: 'ID del Pokémon a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Favorito eliminado correctamente',
  })
  @Delete(':pokemonId')
  removeFavorite(
    @Req() req: RequestWithUser,
    @Param('pokemonId') pokemonId: string,
  ) {
    const userId = req.user.sub;
    return this.favoritesService.removeFavorite(userId, Number(pokemonId));
  }
}
