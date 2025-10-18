import { Module, forwardRef } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { PokemonModule } from '../pokemon/pokemon.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => PokemonModule),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaClient, JwtStrategy],
  exports: [FavoritesService],
})
export class FavoritesModule {}
