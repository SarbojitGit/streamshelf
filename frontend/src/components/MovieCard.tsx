import { useState } from 'react';
import type { Movie } from '../api';
import { useWatchlist } from '../watchlist-context';

export default function MovieCard({ movie }: { movie: Movie }) {
  const { has, add, remove } = useWatchlist();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const saved = has(movie._id);

  const toggle = async () => {
    setBusy(true);
    setFailed(false);
    try {
      if (saved) {
        await remove(movie._id);
      } else {
        await add(movie);
      }
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <h3>{movie.title}</h3>
      <p className="meta">
        {movie.director} · {movie.year}
      </p>
      <div className="tags">
        {movie.genres.map((g) => (
          <span key={g} className="tag">
            {g}
          </span>
        ))}
      </div>
      <button
        className={saved ? 'secondary' : ''}
        onClick={toggle}
        disabled={busy}
      >
        {saved ? 'Remove from watchlist' : 'Add to watchlist'}
      </button>
      {failed && <p className="error">Could not update watchlist</p>}
    </div>
  );
}