import MovieCard from '../components/MovieCard';
import { useWatchlist } from '../watchlist-context';

export default function WatchlistPage() {
  const { movies, loading } = useWatchlist();

  return (
    <div className="container">
      <h2>My watchlist</h2>
      {loading && <p>Loading...</p>}
      {!loading && movies.length === 0 && (
        <p>Your watchlist is empty. Add some movies from the Movies page.</p>
      )}
      <div className="grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}