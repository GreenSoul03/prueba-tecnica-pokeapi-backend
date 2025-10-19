"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonService = void 0;
const common_1 = require("@nestjs/common");
const graphql_request_1 = require("graphql-request");
const favorites_service_1 = require("../favorites/favorites.service");
let PokemonService = class PokemonService {
    favoritesService;
    client;
    limit = 10;
    constructor(favoritesService) {
        this.favoritesService = favoritesService;
        this.client = new graphql_request_1.GraphQLClient('https://beta.pokeapi.co/graphql/v1beta');
    }
    async findAll(name = '', page = 1, userId) {
        const offset = (page - 1) * this.limit;
        const query = (0, graphql_request_1.gql) `
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
            const data = await this.client.request(query, {
                name: `%${name}%`,
                limit: this.limit,
                offset,
            });
            const results = data.pokemon_v2_pokemon.map((p) => {
                let sprite = null;
                if (p.pokemon_v2_pokemonsprites?.length) {
                    try {
                        const parsed = JSON.parse(p.pokemon_v2_pokemonsprites[0].sprites);
                        sprite = parsed.front_default ?? null;
                    }
                    catch {
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
        }
        catch (error) {
            console.error('❌ Error al consultar GraphQL:', error);
            throw new common_1.InternalServerErrorException('Error al obtener datos de PokeAPI');
        }
    }
    async findOne(id, userId) {
        const query = (0, graphql_request_1.gql) `
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
            const data = await this.client.request(query, {
                id,
            });
            const p = data.pokemon_v2_pokemon_by_pk;
            if (!p)
                throw new common_1.NotFoundException(`No se encontró el Pokémon con id ${id}`);
            let sprite = null;
            if (p.pokemon_v2_pokemonsprites?.length) {
                try {
                    const parsed = JSON.parse(p.pokemon_v2_pokemonsprites[0].sprites);
                    sprite = parsed.front_default ?? null;
                }
                catch {
                    sprite = null;
                }
            }
            if (!sprite)
                sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
            const pokemon = {
                id: p.id,
                name: p.name,
                height: p.height,
                weight: p.weight,
                sprite,
                types: p.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name),
                abilities: p.pokemon_v2_pokemonabilities.map((a) => a.pokemon_v2_ability.name),
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            console.error('Error al consultar GraphQL:', error);
            throw new common_1.InternalServerErrorException('Error al obtener detalles del Pokémon');
        }
    }
};
exports.PokemonService = PokemonService;
exports.PokemonService = PokemonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [favorites_service_1.FavoritesService])
], PokemonService);
//# sourceMappingURL=pokemon.service.js.map