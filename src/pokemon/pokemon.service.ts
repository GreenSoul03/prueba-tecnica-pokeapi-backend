import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';

@Injectable()
export class PokemonService {
  private readonly client: GraphQLClient;
  private readonly limit = 10;

  constructor() {
    this.client = new GraphQLClient('https://beta.pokeapi.co/graphql/v1beta');
  }

  // ==============================
  // Obtener lista de Pokémon (paginado)
  // ==============================
  async findAll(name: string = '', page: number = 1) {
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

    const variables = {
      name: `%${name}%`,
      limit: this.limit,
      offset,
    };

    try {
      const data = await this.client.request(query, variables);

      const results = data.pokemon_v2_pokemon.map((p) => {
        let sprite: string | null = null;

        if (p.pokemon_v2_pokemonsprites?.length > 0) {
          try {
            const parsed = JSON.parse(p.pokemon_v2_pokemonsprites[0].sprites);
            sprite = parsed?.front_default ?? null;
          } catch {
            sprite = null;
          }
        }

        if (!sprite) {
          sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
        }

        return {
          id: p.id,
          name: p.name,
          height: p.height,
          weight: p.weight,
          sprite,
          types: p.pokemon_v2_pokemontypes.map(
            (t) => t.pokemon_v2_type.name,
          ),
        };
      });

      return { page, limit: this.limit, results };
    } catch (error) {
      console.error('❌ Error al consultar GraphQL:', JSON.stringify(error, null, 2));
      throw new InternalServerErrorException('Error al obtener datos de PokeAPI');
    }
  }

  // ==============================
  // Obtener detalle individual de un Pokémon
  // ==============================
  async findOne(id: number) {
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

    const variables = { id };

    try {
      const data = await this.client.request(query, variables);
      const p = data.pokemon_v2_pokemon_by_pk;

      if (!p) throw new NotFoundException(`No se encontró el Pokémon con id ${id}`);

      let sprite: string | null = null;

      if (p.pokemon_v2_pokemonsprites?.length > 0) {
        try {
          const parsed = JSON.parse(p.pokemon_v2_pokemonsprites[0].sprites);
          sprite = parsed?.front_default ?? null;
        } catch {
          sprite = null;
        }
      }

      if (!sprite) {
        sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
      }

      return {
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
    } catch (error) {
      console.error('❌ Error al consultar GraphQL:', JSON.stringify(error, null, 2));
      throw new InternalServerErrorException('Error al obtener detalles del Pokémon');
    }
  }
}
