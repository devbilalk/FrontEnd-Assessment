import axios from 'axios';
import type { Dog, SearchResponse, Match } from './types';

const api = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true,
});

export const login = async (name: string, email: string) => {
  await api.post('/auth/login', { name, email });
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getBreeds = async (): Promise<string[]> => {
  const { data } = await api.get('/dogs/breeds');
  return data;
};

export const searchDogs = async (params: {
  breeds?: string[];
  sort?: string;
  size?: number;
  from?: string;
}): Promise<SearchResponse> => {
  const { data } = await api.get('/dogs/search', { params });
  return data;
};

export const getDogs = async (ids: string[]): Promise<Dog[]> => {
  const { data } = await api.post('/dogs', ids);
  return data;
};

export const generateMatch = async (dogIds: string[]): Promise<Match> => {
  const { data } = await api.post('/dogs/match', dogIds);
  return data;
};