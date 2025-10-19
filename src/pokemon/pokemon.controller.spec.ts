import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { PokemonService, Pokemon } from './pokemon.service';

describe('PokemonController', () => {
  let controller: PokemonController;

  const mockPokemonService: Partial<PokemonService> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  // Tipo temporal para simular req.user
  type TestRequestWithUser = { user?: { sub?: number } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [{ provide: PokemonService, useValue: mockPokemonService }],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated Pokémon list', async () => {
      const mockResult = {
        page: 1,
        limit: 10,
        results: [
          {
            id: 1,
            name: 'Bulbasaur',
            height: 7,
            weight: 69,
            sprite: 'url',
            types: ['Grass'],
            isFavorite: true,
          },
        ] as Pokemon[],
      };
      (mockPokemonService.findAll as jest.Mock).mockResolvedValue(mockResult);

      const mockRequest: TestRequestWithUser = { user: { sub: 1 } };
      const result = await controller.findAll(mockRequest, 'Bulba', '1');

      expect(result).toEqual(mockResult);
      expect(mockPokemonService.findAll).toHaveBeenCalledWith('Bulba', 1, 1);
    });

    it('should handle user not logged in', async () => {
      const mockResult = { page: 1, limit: 10, results: [] };
      (mockPokemonService.findAll as jest.Mock).mockResolvedValue(mockResult);

      const mockRequest: TestRequestWithUser = {}; // usuario no logueado
      const result = await controller.findAll(mockRequest, 'Pika');

      expect(result).toEqual(mockResult);
      expect(mockPokemonService.findAll).toHaveBeenCalledWith(
        'Pika',
        1,
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('should return Pokemon details', async () => {
      const mockPokemon: Pokemon = {
        id: 1,
        name: 'Bulbasaur',
        height: 7,
        weight: 69,
        sprite: 'url',
        types: ['Grass'],
        abilities: ['Overgrow'],
        stats: [{ name: 'hp', base_stat: 45 }],
        isFavorite: true,
      };
      (mockPokemonService.findOne as jest.Mock).mockResolvedValue(mockPokemon);

      const mockRequest: TestRequestWithUser = { user: { sub: 1 } };
      const result = await controller.findOne('1', mockRequest);

      expect(result).toEqual(mockPokemon);
      expect(mockPokemonService.findOne).toHaveBeenCalledWith(1, 1);
    });

    it('should handle user not logged in', async () => {
      const mockPokemon: Pokemon = {
        id: 2,
        name: 'Ivysaur',
        height: 10,
        weight: 130,
        sprite: 'url',
        types: ['Grass'],
      };
      (mockPokemonService.findOne as jest.Mock).mockResolvedValue(mockPokemon);

      const mockRequest: TestRequestWithUser = {}; // usuario no logueado
      const result = await controller.findOne('2', mockRequest);

      expect(result).toEqual(mockPokemon);
      expect(mockPokemonService.findOne).toHaveBeenCalledWith(2, undefined);
    });
  });
});
