
import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import { getMovies } from '../../services/movieService';
import { Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';

function App() {
  const [movie, setMovie] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleSubmit = async (value: string) => {
    setIsEmpty(false);
    setMovie([]);
    setIsLoading(true);
    setIsError(false);

    try {
      const data = await getMovies(value);
      if (!data.length) {
        setIsEmpty(true);
        return;
      }
      setMovie(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const closeModal = () => {
    setSelectedMovie(null);
  };
  return (
    <>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster />
      {movie.length > 0 && (
        <MovieGrid onSelect={handleMovieClick} movies={movie} />
      )}
      {isEmpty && <p>No movies found for your request.</p>}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      {isLoading && <Loader />}
    </>
  );
}

export default App;