import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { JwtStrategy } from './strategies/jwt.strategy'; // 👈 importa aquí

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'GENGAR',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaClient, JwtStrategy], // 👈 agrega JwtStrategy aquí
  exports: [AuthService],
})
export class AuthModule {}
