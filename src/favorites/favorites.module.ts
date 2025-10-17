import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'GENGAR',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaClient, JwtStrategy],
  exports: [FavoritesService],
})
export class FavoritesModule {}
