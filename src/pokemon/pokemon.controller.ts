import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(JwtAuthGuard) // protege la ruta si quieres marcar favoritos
  @Get()
  async findAll(@Req() req, @Query('name') name?: string, @Query('page') page?: string) {
    const pageNum = page ? parseInt(page) : 1;
    const userId = req.user?.sub; // viene del JWT
    return this.pokemonService.findAll(name || '', pageNum, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(Number(id));
  }
}
