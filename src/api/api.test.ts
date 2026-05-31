import { fetchPokemon, fetchPokemonList } from './api';
import { request } from './client';
import { server } from '@/test-utils/msw/server';
import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';

describe('request', () => {
  it('returns json on success', async () => {
    server.use(http.get('/test', () => HttpResponse.json({ name: 'pikachu' })));
    const result = await request('/test');
    expect(result).toEqual({ name: 'pikachu' });
  });

  it('throws server error on 500', async () => {
    server.use(http.get('/test', () => HttpResponse.json({}, { status: 500 })));
    await expect(request('/test')).rejects.toThrow(
      'Server error. Please try again later.'
    );
  });

  it('throws generic error on 400', async () => {
    server.use(http.get('/test', () => HttpResponse.json({}, { status: 400 })));
    await expect(request('/test')).rejects.toThrow(
      'Request failed with status 400'
    );
  });
});

describe('fetchPokemon', () => {
  it('returns mapped pokemon', async () => {
    const result = await fetchPokemon('bulbasaur');
    expect(result.name).toBe('bulbasaur');
    expect(result.types).toEqual(['grass', 'poison']);
  });

  it('throws custom 404 error with pokemon name', async () => {
    server.use(
      http.get(`${BASE_URL}/unknown`, () =>
        HttpResponse.json({}, { status: 404 })
      )
    );
    await expect(fetchPokemon('unknown')).rejects.toThrow(
      'Pokémon "unknown" not found. Try a different name!'
    );
  });

  it('throws server error on 500', async () => {
    server.use(
      http.get(`${BASE_URL}/bulbasaur`, () =>
        HttpResponse.json({}, { status: 500 })
      )
    );
    await expect(fetchPokemon('bulbasaur')).rejects.toThrow(
      'Server error. Please try again later.'
    );
  });

  it('throws generic error on 400', async () => {
    server.use(
      http.get(`${BASE_URL}/bulbasaur`, () =>
        HttpResponse.json({}, { status: 400 })
      )
    );
    await expect(fetchPokemon('bulbasaur')).rejects.toThrow(
      'Request failed with status 400'
    );
  });
});

describe('fetchPokemonList', () => {
  it('returns list of mapped pokemons with totalPages', async () => {
    const result = await fetchPokemonList(1);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('bulbasaur');
    expect(result.totalPages).toBeDefined();
    expect(typeof result.totalPages).toBe('number');
  });

  it('throws server error on 500', async () => {
    server.use(
      http.get(BASE_URL, () => HttpResponse.json({}, { status: 500 }))
    );
    await expect(fetchPokemonList(1)).rejects.toThrow(
      'Server error. Please try again later.'
    );
  });

  it('throws generic error on 400', async () => {
    server.use(
      http.get(BASE_URL, () => HttpResponse.json({}, { status: 400 }))
    );
    await expect(fetchPokemonList(1)).rejects.toThrow(
      'Request failed with status 400'
    );
  });
});
