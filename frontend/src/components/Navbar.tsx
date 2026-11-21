import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth-context';
import { useWatchlist } from '../watchlist-context';

export default function Navbar() {
  const { email, logout } = useAuth();
  const { movies } = useWatchlist();

  return (
    <nav className="navbar">
      <span className="brand">StreamShelf</span>
      <div className="nav-links">
        <NavLink to="/" end>
          Movies
        </NavLink>
        <NavLink to="/watchlist">Watchlist ({movies.length})</NavLink>
      </div>
      <div className="nav-user">
        <span>{email}</span>
        <button className="secondary" onClick={logout}>
          Log out
        </button>
      </div>
    </nav>
  );
}