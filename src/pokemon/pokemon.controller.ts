import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PokemonService, Pokemon } from './pokemon.service';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  email: string;
}

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@ApiTags('Pokémon')
@Controller('api/v1/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(OptionalJwtAuthGuard) // JWT opcional
  @ApiOperation({ summary: 'Listar Pokémon paginados con opción de favoritos' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Nombre parcial para filtrar Pokémon',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página (paginación)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de Pokémon devuelta correctamente',
  })
  @ApiBearerAuth()
  @Get()
  async findAll(
    @Req() req: RequestWithUser,
    @Query('name') name?: string,
    @Query('page') page?: string,
  ): Promise<{ page: number; limit: number; results: Pokemon[] }> {
    const pageNum = page ? parseInt(page) : 1;
    const userId = req.user?.sub;
    return this.pokemonService.findAll(name || '', pageNum, userId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Obtener detalles de un Pokémon por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del Pokémon' })
  @ApiResponse({
    status: 200,
    description: 'Detalles del Pokémon devueltos correctamente',
  })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Pokemon> {
    const userId = req.user?.sub;
    return this.pokemonService.findOne(Number(id), userId);
  }
}
