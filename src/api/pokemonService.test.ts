import { pokemonService } from './pokemonService';
import { server } from '@/test-utils/msw/server';
import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';

describe('pokemonService', () => {
  describe('getByName', () => {
    it('returns parsed pokemon', async () => {
      const result = await pokemonService.getByName('bulbasaur');
      expect(result.name).toBe('bulbasaur');
      expect(result.types).toEqual(['grass', 'poison']);
    });

    it('throws 404 error', async () => {
      server.use(
        http.get(`${BASE_URL}/:name`, () =>
          HttpResponse.json({}, { status: 404 })
        )
      );
      await expect(pokemonService.getByName('unknown')).rejects.toThrow(
        'Pokémon "unknown" not found. Try a different name!'
      );
    });

    it('throws 500 error', async () => {
      server.use(
        http.get(`${BASE_URL}/:name`, () =>
          HttpResponse.json({}, { status: 500 })
        )
      );
      await expect(pokemonService.getByName('bulbasaur')).rejects.toThrow(
        'Server error. Please try again later.'
      );
    });
  });

  describe('getPage', () => {
    it('returns list of pokemons', async () => {
      const result = await pokemonService.getPage(1);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('bulbasaur');
    });

    it('throws 500 error', async () => {
      server.use(
        http.get(BASE_URL, () => HttpResponse.json({}, { status: 500 }))
      );
      await expect(pokemonService.getPage(1)).rejects.toThrow(
        'Server error. Please try again later.'
      );
    });

    it('throws generic error for list', async () => {
      server.use(
        http.get(BASE_URL, () => HttpResponse.json({}, { status: 400 }))
      );
      await expect(pokemonService.getPage(1)).rejects.toThrow(
        'Failed to get Pokémon list (400)'
      );
    });

    it('throws generic error for pokemon', async () => {
      server.use(
        http.get(`${BASE_URL}/:name`, () =>
          HttpResponse.json({}, { status: 400 })
        )
      );
      await expect(pokemonService.getByName('bulbasaur')).rejects.toThrow(
        'Request failed with status 400'
      );
    });
  });
});
