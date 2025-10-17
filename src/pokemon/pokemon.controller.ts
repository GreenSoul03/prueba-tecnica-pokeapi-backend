import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('api/v1/pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  async findAll(
    @Query('name') name?: string,
    @Query('page') page?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    return this.pokemonService.findAll(name || '', pageNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(Number(id));
  }
}
