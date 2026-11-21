import { createContext, useContext } from 'react';
import type { Movie } from './api';

export interface WatchlistState {
  movies: Movie[];
  loading: boolean;
  has: (id: string) => boolean;
  add: (movie: Movie) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const WatchlistContext = createContext<WatchlistState | null>(null);

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used inside WatchlistProvider');
  return ctx;
}