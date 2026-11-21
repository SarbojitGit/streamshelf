import { useEffect, useState, type ReactNode } from 'react';
import { api, ApiError, type Movie } from './api';
import { useAuth } from './auth-context';
import { WatchlistContext } from './watchlist-context';

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { token, logout } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api<Movie[]>('/watchlist', { token })
      .then((data) => {
        if (!cancelled) setMovies(data);
      })
      .catch((err) => {
        // An expired or invalid token sends the user back to the login page
        if (err instanceof ApiError && err.status === 401) logout();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const add = async (movie: Movie) => {
    await api(`/watchlist/${movie._id}`, { method: 'POST', token });
    setMovies((prev) => [movie, ...prev]);
  };

  const remove = async (id: string) => {
    await api(`/watchlist/${id}`, { method: 'DELETE', token });
    setMovies((prev) => prev.filter((m) => m._id !== id));
  };

  const has = (id: string) => movies.some((m) => m._id === id);

  return (
    <WatchlistContext.Provider value={{ movies, loading, has, add, remove }}>
      {children}
    </WatchlistContext.Provider>
  );
}