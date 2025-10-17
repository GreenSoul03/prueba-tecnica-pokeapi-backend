import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [AuthModule, PrismaModule, FavoritesModule],
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [AuthModule, PrismaModule, PokemonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
