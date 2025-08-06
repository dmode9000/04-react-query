// React core
import { useCallback, useEffect, useRef, useState } from "react";

// Libraries
import toast, { Toaster } from "react-hot-toast";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

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
import css from "./App.module.css";

export default function App() {
  // стан з пошуковим запитом введеним у форму
  const [searchQuery, setSearchQuery] = useState("");
  // стан з вибраним фільмом, встановлюється при кліку на елемент списку фільмів
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  // стан зі сторінкою пагінації
  const [currentPage, setCurrentPage] = useState<number>(1);
  // реф для визначення першого запиту до апі
  const isFirstSearch = useRef(true);

  // константи відповіді на запит до апі
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    isPlaceholderData, // якщо true то очікуються нові дані, а поточні застарілі
  } = useQuery({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: searchQuery !== "",
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  const totalResults = data?.total_results ?? 0;

  useEffect(() => {
    // якщо запит успішний і виконаний перший раз
    if (isSuccess && isFirstSearch.current) {
      if (totalResults === 0) {
        // якщо нічого не знайдено вивожу повідомлення
        toast.error("No movies found for your request.");
      } else {
        // вивожу повідомленя скільки фільмів знайдено
        toast.success(`found ${totalResults} movies`);
      }
      // забезпечення запуску цього блоку лише раз при першому пошуці
      isFirstSearch.current = false;
    }
    // в разі помилки
    if (isError) {
      // вивожу повідомлення про помилку
      const message = error instanceof Error ? error.message : "uknown error";
      toast.error(message);
    }
  }, [isSuccess, error, totalResults, isError]);

  // функція що передається в компонент SearchBar для отримання пошукового запиту
  const handleSearch = (query: string) => {
    isFirstSearch.current = true;
    setCurrentPage(1);
    setSearchQuery(query);
  };

  // функції відкриття/закриття модального вікна
  const openModal = useCallback((movie: Movie) => setSelectedMovie(movie), []);
  const closeModal = useCallback(() => setSelectedMovie(null), []);

  //console.log("render App");

  return (
    <>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {/* обгортка для приглушення старих даних поки нові ще не завантажились при кліку на кнопки пагінації */}
      <div className={isPlaceholderData ? css.loading : ""}>
        {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}
      </div>
      {isError && <ErrorMessage />}
      {isLoading && !isPlaceholderData && <Loader />}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </>
  );
}
