import axios from "axios";
import type { ApiSearchResponse } from "../types/movie";

export const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies(query: string, page: number): Promise<ApiSearchResponse> {
  const response = await axios.get<ApiSearchResponse>(`movie`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    baseURL: "https://api.themoviedb.org/3/search/",
    params: {
      query: query,
      page: page,
    },
  });
  return response.data;
}
