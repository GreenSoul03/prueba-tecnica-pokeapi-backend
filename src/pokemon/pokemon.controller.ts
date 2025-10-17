import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Pokémon')
@Controller('api/v1/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar Pokémon paginados con opción de favoritos' })
  @ApiQuery({ name: 'name', required: false, description: 'Nombre parcial para filtrar Pokémon' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página (paginación)' })
  @ApiResponse({ status: 200, description: 'Lista de Pokémon devuelta correctamente' })
  @Get()
  async findAll(@Req() req, @Query('name') name?: string, @Query('page') page?: string) {
    const pageNum = page ? parseInt(page) : 1;
    const userId = req.user?.sub;
    return this.pokemonService.findAll(name || '', pageNum, userId);
  }

  @ApiOperation({ summary: 'Obtener detalles de un Pokémon por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del Pokémon' })
  @ApiResponse({ status: 200, description: 'Detalles del Pokémon devueltos correctamente' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(Number(id));
  }
}
