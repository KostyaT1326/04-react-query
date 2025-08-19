import axios from 'axios';
import type { Movie } from '../types/movie';

const API_KEY = (import.meta.env.VITE_TMDB_TOKEN || '') as string;

axios.defaults.baseURL = 'https://api.themoviedb.org/3/';
axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;
axios.defaults.headers.common['accept'] = 'application/json';

interface MoviesResponse {
    results: Movie[];
}

export const getMovies = async (query: string): Promise<Movie[]> => {
    const response = await axios.get<MoviesResponse>(`search/movie`, {
        params: { query },
    });
    return response.data.results;
};