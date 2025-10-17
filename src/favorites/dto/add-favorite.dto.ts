import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteDto {
  @ApiProperty({ description: 'ID del Pokémon a agregar', example: 25 })
  @IsInt()
  @Min(1)
  pokemonId: number;
}
