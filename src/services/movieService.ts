import axios from 'axios';

import type { Movie } from '../types/movie';

export interface MoviesResponse {
    results: Movie[];
    total_pages: number;
}

const API_KEY = (import.meta.env.VITE_TMDB_TOKEN || '') as string;

axios.defaults.baseURL = 'https://api.themoviedb.org/3/';
axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;
axios.defaults.headers.common['accept'] = 'application/json';



export const getMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
    const response = await axios.get<MoviesResponse>(`search/movie`, {
        params: { query, page },
    });
    return response.data;
};