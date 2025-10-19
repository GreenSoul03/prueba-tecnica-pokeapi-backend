import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';
import { FavoritesService } from '../favorites/favorites.service';

type PokemonSprite = { sprites: string };
type PokemonType = { pokemon_v2_type: { name: string } };
type PokemonAbility = { pokemon_v2_ability: { name: string } };
type PokemonStat = { base_stat: number; pokemon_v2_stat: { name: string } };

type PokemonGraphQL = {
  id: number;
  name: string;
  height: number;
  weight: number;
  pokemon_v2_pokemonsprites?: PokemonSprite[];
  pokemon_v2_pokemontypes: PokemonType[];
};

type PokemonDetailGraphQL = PokemonGraphQL & {
  pokemon_v2_pokemonabilities: PokemonAbility[];
  pokemon_v2_pokemonstats: PokemonStat[];
};

interface PokemonListResponse {
  pokemon_v2_pokemon: PokemonGraphQL[];
}

interface PokemonDetailResponse {
  pokemon_v2_pokemon_by_pk: PokemonDetailGraphQL | null;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprite: string;
  types: string[];
  abilities?: string[];
  stats?: { name: string; base_stat: number }[];
  isFavorite?: boolean;
}

@Injectable()
export class PokemonService {
  private readonly client: GraphQLClient;
  private readonly limit = 10;

  constructor(private readonly favoritesService: FavoritesService) {
    this.client = new GraphQLClient('https://beta.pokeapi.co/graphql/v1beta');
  }

  async findAll(
    name = '',
    page = 1,
    userId?: number,
  ): Promise<{ page: number; limit: number; results: Pokemon[] }> {
    const offset = (page - 1) * this.limit;

    const query = gql`
      query getPokemonList($name: String, $limit: Int, $offset: Int) {
        pokemon_v2_pokemon(
          where: { name: { _ilike: $name } }
          limit: $limit
          offset: $offset
        ) {
          id
          name
          height
          weight
          pokemon_v2_pokemonsprites {
            sprites
          }
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
            }
          }
        }
      }
    `;

    try {
      const data = await this.client.request<PokemonListResponse>(query, {
        name: `%${name}%`,
        limit: this.limit,
        offset,
      });

      const results: Pokemon[] = data.pokemon_v2_pokemon.map((p) => {
        let sprite: string | null = null;

        if (p.pokemon_v2_pokemonsprites?.length) {
          try {
            const parsed = JSON.parse(
              p.pokemon_v2_pokemonsprites[0].sprites,
            ) as { front_default?: string };
            sprite = parsed.front_default ?? null;
          } catch {
            sprite = null;
          }
        }

        if (!sprite)
          sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;

        return {
          id: p.id,
          name: p.name,
          height: p.height,
          weight: p.weight,
          sprite,
          types: p.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name),
        };
      });

      if (userId) {
        const favoriteIds = await this.favoritesService.getFavoritesIds(userId);
        results.forEach((p) => (p.isFavorite = favoriteIds.includes(p.id)));
      }

      return { page, limit: this.limit, results };
    } catch (error) {
      console.error('❌ Error al consultar GraphQL:', error);
      throw new InternalServerErrorException(
        'Error al obtener datos de PokeAPI',
      );
    }
  }

  async findOne(id: number, userId?: number): Promise<Pokemon> {
    const query = gql`
      query getPokemonById($id: Int!) {
        pokemon_v2_pokemon_by_pk(id: $id) {
          id
          name
          height
          weight
          pokemon_v2_pokemonsprites {
            sprites
          }
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
            }
          }
          pokemon_v2_pokemonabilities {
            pokemon_v2_ability {
              name
            }
          }
          pokemon_v2_pokemonstats {
            base_stat
            pokemon_v2_stat {
              name
            }
          }
        }
      }
    `;

    try {
      const data = await this.client.request<PokemonDetailResponse>(query, {
        id,
      });

      const p = data.pokemon_v2_pokemon_by_pk;
      if (!p)
        throw new NotFoundException(`No se encontró el Pokémon con id ${id}`);

      let sprite: string | null = null;
      if (p.pokemon_v2_pokemonsprites?.length) {
        try {
          const parsed = JSON.parse(p.pokemon_v2_pokemonsprites[0].sprites) as {
            front_default?: string;
          };
          sprite = parsed.front_default ?? null;
        } catch {
          sprite = null;
        }
      }

      if (!sprite)
        sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;

      const pokemon: Pokemon = {
        id: p.id,
        name: p.name,
        height: p.height,
        weight: p.weight,
        sprite,
        types: p.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name),
        abilities: p.pokemon_v2_pokemonabilities.map(
          (a) => a.pokemon_v2_ability.name,
        ),
        stats: p.pokemon_v2_pokemonstats.map((s) => ({
          name: s.pokemon_v2_stat.name,
          base_stat: s.base_stat,
        })),
      };

      if (userId) {
        const favoriteIds = await this.favoritesService.getFavoritesIds(userId);
        pokemon.isFavorite = favoriteIds.includes(id);
      }

      return pokemon;
    } catch (error) {
      // Dejar pasar NotFoundException
      if (error instanceof NotFoundException) throw error;

      console.error('Error al consultar GraphQL:', error);
      throw new InternalServerErrorException(
        'Error al obtener detalles del Pokémon',
      );
    }
  }
}
