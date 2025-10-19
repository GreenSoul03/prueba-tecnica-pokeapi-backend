import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// ----------------------------
// MOCK GLOBAL DE BCRYPT
// ----------------------------
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaClient;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'PRISMA_CLIENT',
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaClient>('PRISMA_CLIENT');
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw if user already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      const dto: RegisterDto = {
        email: 'a@b.com',
        password: '1234',
        name: 'User',
      };
      await expect(service.register(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if hashPassword fails', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const dto: RegisterDto = {
        email: 'a@b.com',
        password: '1234',
        name: 'User',
      };
      await expect(service.register(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should create user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'User',
        email: 'a@b.com',
        password: 'hash',
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const dto: RegisterDto = {
        email: 'a@b.com',
        password: '1234',
        name: 'User',
      };
      const result = await service.register(dto);
      expect(result).toEqual({
        message: 'Usuario creado correctamente',
        userId: 1,
      });
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const dto: LoginDto = { email: 'a@b.com', password: '1234' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password invalid', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'a@b.com',
        password: 'hash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const dto: LoginDto = { email: 'a@b.com', password: '1234' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if comparePassword fails', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'a@b.com',
        password: 'hash',
      });
      (bcrypt.compare as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const dto: LoginDto = { email: 'a@b.com', password: '1234' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return token on successful login', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'a@b.com',
        password: 'hash',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('jwt-token');

      const dto: LoginDto = { email: 'a@b.com', password: '1234' };
      const result = await service.login(dto);
      expect(result).toEqual({ access_token: 'jwt-token' });
    });
  });
});
