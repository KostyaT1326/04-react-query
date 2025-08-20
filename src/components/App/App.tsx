
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import { getMovies } from '../../services/movieService';
import type { MoviesResponse } from '../../services/movieService';
import { Toaster, toast } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';


function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery<MoviesResponse, Error>({
    queryKey: ['movies', query, page],
    queryFn: () => getMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  const handleSubmit = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;
  const isEmpty = query && !isLoading && movies.length === 0;

  useEffect(() => {
    if (isEmpty) {
      toast('No movies found for your request.');
    }
  }, [isEmpty]);

  return (
    <>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster />
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {movies.length > 0 && (
        <MovieGrid onSelect={handleMovieClick} movies={movies} />
      )}
  {/* isEmpty handled by toast */}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      {(isLoading || isFetching) && <Loader />}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
    </>
  );
}

export default App;