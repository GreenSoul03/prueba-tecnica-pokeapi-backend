import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { PokemonService } from '../pokemon/pokemon.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, Favorite, User } from '@prisma/client';

describe('FavoritesService', () => {
  let service: FavoritesService;

  // Mock de Prisma
  const mockPrisma: Partial<PrismaClient> = {
    user: {
      findUnique: jest.fn() as unknown as jest.Mock<
        Promise<User | null>,
        [any]
      >,
    },
    favorite: {
      findFirst: jest.fn() as unknown as jest.Mock<
        Promise<Favorite | null>,
        [any]
      >,
      findMany: jest.fn() as unknown as jest.Mock<Promise<Favorite[]>, [any]>,
      create: jest.fn() as unknown as jest.Mock<Promise<Favorite>, [any]>,
      delete: jest.fn() as unknown as jest.Mock<Promise<Favorite>, [any]>,
    },
  };

  // Mock del PokemonService
  const mockPokemonService: Partial<PokemonService> = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: 'PRISMA_CLIENT', useValue: mockPrisma },
        { provide: PokemonService, useValue: mockPokemonService },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ================= ADD FAVORITE =================
  describe('addFavorite', () => {
    it('should add favorite if user exists and not already favorite', async () => {
      (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrisma.favorite!.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.favorite!.create as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        pokemonId: 25,
      });

      const result = await service.addFavorite(1, 25);
      expect(result).toEqual({ id: 1, userId: 1, pokemonId: 25 });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.addFavorite(999, 25)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if favorite already exists', async () => {
      (mockPrisma.user!.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrisma.favorite!.findFirst as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        pokemonId: 25,
      });
      await expect(service.addFavorite(1, 25)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ================= GET FAVORITES IDS =================
  describe('getFavoritesIds', () => {
    it('should return an array of pokemonIds', async () => {
      (mockPrisma.favorite!.findMany as jest.Mock).mockResolvedValue([
        { pokemonId: 1 },
        { pokemonId: 2 },
      ]);
      const result = await service.getFavoritesIds(1);
      expect(result).toEqual([1, 2]);
    });
  });

  // ================= GET FAVORITES DETAILED =================
  describe('getFavoritesDetailed', () => {
    it('should return detailed favorites with Pokemon info', async () => {
      (mockPrisma.favorite!.findMany as jest.Mock).mockResolvedValue([
        { id: 1, userId: 1, pokemonId: 1, createdAt: new Date() },
      ]);
      (mockPokemonService.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Bulbasaur',
        height: 7,
        weight: 69,
        sprite: 'url',
        types: ['Grass'],
        abilities: ['Overgrow'],
        stats: [{ name: 'hp', base_stat: 45 }],
        isFavorite: true,
      });

      const result = await service.getFavoritesDetailed(1);
      expect(result.length).toBe(1);
      expect(result[0].pokemon.name).toBe('Bulbasaur');
    });

    it('should filter by name', async () => {
      (mockPrisma.favorite!.findMany as jest.Mock).mockResolvedValue([
        { id: 1, userId: 1, pokemonId: 1, createdAt: new Date() },
        { id: 2, userId: 1, pokemonId: 2, createdAt: new Date() },
      ]);

      (mockPokemonService.findOne as jest.Mock).mockImplementation(
        (id: number) => ({
          id,
          name: id === 1 ? 'Bulbasaur' : 'Charmander',
          height: 7,
          weight: 69,
          sprite: 'url',
          types: ['Grass'],
          abilities: ['Overgrow'],
          stats: [{ name: 'hp', base_stat: 45 }],
          isFavorite: true,
        }),
      );

      const result = await service.getFavoritesDetailed(1, 1, 20, 'charm');
      expect(result.length).toBe(1);
      expect(result[0].pokemon.name).toBe('Charmander');
    });
  });

  // ================= REMOVE FAVORITE =================
  describe('removeFavorite', () => {
    it('should remove existing favorite', async () => {
      (mockPrisma.favorite!.findFirst as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        pokemonId: 25,
      });
      (mockPrisma.favorite!.delete as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        pokemonId: 25,
      });

      const result = await service.removeFavorite(1, 25);
      expect(result).toEqual({ id: 1, userId: 1, pokemonId: 25 });
    });

    it('should throw NotFoundException if favorite does not exist', async () => {
      (mockPrisma.favorite!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.removeFavorite(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
