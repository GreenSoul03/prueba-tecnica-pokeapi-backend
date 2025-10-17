import { Module, forwardRef } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [forwardRef(() => FavoritesModule)], // rompe ciclo
  controllers: [PokemonController],
  providers: [PokemonService],
  exports: [PokemonService], // <-- exportamos para que FavoritesService pueda inyectarlo
})
export class PokemonModule {}
