import { useEffect, useState } from 'react';
import { api, type MoviePage } from '../api';
import MovieCard from '../components/MovieCard';

const GENRES = [
  'Drama',
  'Music',
  'Romance',
  'Fantasy',
  'Musical',
  'Adventure',
  'Mystery',
];

export default function MoviesPage() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MoviePage | null>(null);
  const [error, setError] = useState('');

  // Wait 300 ms after the user stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: String(page), limit: '6' });
    if (query) params.set('q', query);
    if (genre) params.set('genre', genre);

    api<MoviePage>(`/movies?${params.toString()}`)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load movies');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [query, genre, page]);

  return (
    <div className="container">
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {!data && !error && <p>Loading...</p>}

      {data && data.items.length === 0 && <p>No movies found.</p>}

      {data && data.items.length > 0 && (
        <>
          <div className="grid">
            {data.items.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          <div className="pagination">
            <button
              className="secondary"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>
              Page {data.page} of {data.pages}
            </span>
            <button
              className="secondary"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.pages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}