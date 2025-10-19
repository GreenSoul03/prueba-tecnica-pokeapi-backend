import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService, Pokemon } from './pokemon.service';
import { FavoritesService } from '../favorites/favorites.service';
import { GraphQLClient } from 'graphql-request';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('PokemonService', () => {
  let service: PokemonService;
  let mockClient: jest.Mocked<GraphQLClient>;

  const mockFavoritesService: Partial<FavoritesService> = {
    getFavoritesIds: jest.fn(),
  };

  const mockPokemonList = {
    pokemon_v2_pokemon: [
      {
        id: 1,
        name: 'Bulbasaur',
        height: 7,
        weight: 69,
        pokemon_v2_pokemonsprites: [
          { sprites: '{"front_default":"sprite_url"}' },
        ],
        pokemon_v2_pokemontypes: [{ pokemon_v2_type: { name: 'Grass' } }],
      },
      {
        id: 2,
        name: 'Ivysaur',
        height: 10,
        weight: 130,
        pokemon_v2_pokemonsprites: [],
        pokemon_v2_pokemontypes: [{ pokemon_v2_type: { name: 'Grass' } }],
      },
    ],
  };

  const mockPokemonDetail = {
    pokemon_v2_pokemon_by_pk: {
      id: 1,
      name: 'Bulbasaur',
      height: 7,
      weight: 69,
      pokemon_v2_pokemonsprites: [
        { sprites: '{"front_default":"sprite_url"}' },
      ],
      pokemon_v2_pokemontypes: [{ pokemon_v2_type: { name: 'Grass' } }],
      pokemon_v2_pokemonabilities: [
        { pokemon_v2_ability: { name: 'Overgrow' } },
      ],
      pokemon_v2_pokemonstats: [
        { base_stat: 45, pokemon_v2_stat: { name: 'hp' } },
      ],
    },
  };

  beforeEach(async () => {
    // Mock tipo seguro de GraphQLClient
    mockClient = {
      request: jest.fn(),
    } as unknown as jest.Mocked<GraphQLClient>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        { provide: FavoritesService, useValue: mockFavoritesService },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);

    // Inyectamos el cliente mock usando propiedad privada con casting seguro
    (
      service as PokemonService & { client: jest.Mocked<GraphQLClient> }
    ).client = mockClient;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated Pokemon list with favorites', async () => {
      mockClient.request.mockResolvedValue(mockPokemonList);
      (mockFavoritesService.getFavoritesIds as jest.Mock).mockResolvedValue([
        1,
      ]);

      const result = await service.findAll('Bulba', 1, 10);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.results.length).toBe(2);
      expect(result.results[0].isFavorite).toBe(true);
      expect(result.results[1].isFavorite).toBe(false);
    });

    it('should throw InternalServerErrorException on GraphQL error', async () => {
      mockClient.request.mockRejectedValue(new Error('GraphQL fail'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return Pokemon details with favorites', async () => {
      mockClient.request.mockResolvedValue(mockPokemonDetail);
      (mockFavoritesService.getFavoritesIds as jest.Mock).mockResolvedValue([
        1,
      ]);

      const result: Pokemon = await service.findOne(1, 1);
      expect(result.id).toBe(1);
      expect(result.abilities).toContain('Overgrow');
      expect(result.stats[0].name).toBe('hp');
      expect(result.isFavorite).toBe(true);
    });

    it('should throw NotFoundException if Pokemon not found', async () => {
      mockClient.request.mockResolvedValue({ pokemon_v2_pokemon_by_pk: null });

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on GraphQL error', async () => {
      mockClient.request.mockRejectedValue(new Error('GraphQL fail'));

      await expect(service.findOne(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
