import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService, FavoriteDetailed } from './favorites.service';

// Tipo temporal para RequestWithUser
interface RequestWithUser {
  user?: {
    sub?: number;
  };
}

describe('FavoritesController', () => {
  let controller: FavoritesController;

  const mockFavoritesService: jest.Mocked<
    Pick<
      FavoritesService,
      'addFavorite' | 'getFavoritesDetailed' | 'removeFavorite'
    >
  > = {
    addFavorite: jest.fn<
      Promise<{ id: number; userId: number; pokemonId: number }>,
      [number, number]
    >(),
    getFavoritesDetailed: jest.fn<
      Promise<FavoriteDetailed[]>,
      [number, number?, number?, string?, string?, string?]
    >(),
    removeFavorite: jest.fn<
      Promise<{ id: number; userId: number; pokemonId: number }>,
      [number, number]
    >(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        { provide: FavoritesService, useValue: mockFavoritesService },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ================= ADD FAVORITE =================
  describe('addFavorite', () => {
    it('should add a favorite for a user', async () => {
      const mockFavorite = { id: 1, userId: 1, pokemonId: 25 };
      mockFavoritesService.addFavorite.mockResolvedValue(mockFavorite);

      const mockRequest: RequestWithUser = { user: { sub: 1 } };
      const result = await controller.addFavorite(mockRequest, '25');

      expect(result).toEqual(mockFavorite);
      expect(mockFavoritesService.addFavorite).toHaveBeenCalledWith(1, 25);
    });
  });

  // ================= GET FAVORITES =================
  describe('getFavorites', () => {
    it('should return detailed favorites', async () => {
      const mockFavorites: FavoriteDetailed[] = [
        {
          id: 1,
          userId: 1,
          pokemonId: 25,
          createdAt: new Date(),
          pokemon: {
            id: 25,
            name: 'Pikachu',
            types: ['Electric'],
            sprite: 'url',
            abilities: ['Static'],
            stats: [{ name: 'hp', base_stat: 35 }],
            isFavorite: true,
          },
        },
      ];
      mockFavoritesService.getFavoritesDetailed.mockResolvedValue(
        mockFavorites,
      );

      const mockRequest: RequestWithUser = { user: { sub: 1 } };
      const result = await controller.getFavorites(mockRequest, '1', '20');

      expect(result).toEqual(mockFavorites);
      expect(mockFavoritesService.getFavoritesDetailed).toHaveBeenCalledWith(
        1,
        1,
        20,
        undefined,
        undefined,
        undefined,
      );
    });
  });

  // ================= REMOVE FAVORITE =================
  describe('removeFavorite', () => {
    it('should remove a favorite for a user', async () => {
      const mockFavorite = { id: 1, userId: 1, pokemonId: 25 };
      mockFavoritesService.removeFavorite.mockResolvedValue(mockFavorite);

      const mockRequest: RequestWithUser = { user: { sub: 1 } };
      const result = await controller.removeFavorite(mockRequest, '25');

      expect(result).toEqual(mockFavorite);
      expect(mockFavoritesService.removeFavorite).toHaveBeenCalledWith(1, 25);
    });
  });
});
