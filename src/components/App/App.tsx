// React core
import { useCallback, useEffect, useState } from "react";

// Libraries
import toast, { Toaster } from "react-hot-toast";

// Services
import { fetchMovies } from "../../services/movieService";

// Components
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";

// Types
import type { Movie } from "../../types/movie";

// Styles
import "./App.module.css";

export default function App() {
  // стан завантаження, встановлюється перед виконанням запиту до АРІ
  const [isLoading, setIsLoading] = useState(false);
  // стан зі списком фільмів, встановлюється при успішному виконанні запиту до АРІ
  const [movies, setMovies] = useState<Movie[]>([]);
  // стан з вибраним фільмом, встановлюється при кліку на елемент списку фільмів
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {}, []);

  // функція отримання списку фільмів по ключовому запиту, та логіка обробки помилок
  const getMovies = useCallback(
    async (query: string) => {
      // очищення колекції фільмів з попереднього пошуку
      if (movies.length > 0) setMovies([]);

      // очищення стану помилки з попереднього пошуку
      if (isError) setIsError(false);

      // активація стану завантаження
      setIsLoading(true);

      try {
        // читання з апі
        const { results } = await fetchMovies(query);

        if (results.length === 0) {
          // якщо нічого не знайдено вивожу повідомлення
          toast.error("No movies found for your request.");
        } else {
          // якщо отриманий масив фільмів
          // залишаю лише фільми з наявними картинками постерів
          const filtered = results.filter((e) => e.poster_path !== null);
          // встановлюю масив фільмів у стан компонента
          setMovies(filtered);
          // вивожу повідомленя скільки фільмів знайдено
          toast.success(`found ${results.length.toString()} movies`);
        }
      } catch (error) {
        setIsError(true);
        // в разі помилки вивожу повідомлення про помилку
        const message = error instanceof Error ? error.message : "uknown error";
        toast.error(message);
      } finally {
        // відміна стану завантаження
        setIsLoading(false);
      }
    },
    [isError, movies]
  );

  // функції відкриття/закриття модального вікна
  const openModal = useCallback((movie: Movie) => setSelectedMovie(movie), []);
  const closeModal = useCallback(() => setSelectedMovie(null), []);

  console.log("render App");

  return (
    <>
      <Toaster position="top-center" />
      <SearchBar onSubmit={getMovies} />
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </>
  );
}
