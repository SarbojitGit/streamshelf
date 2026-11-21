import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth-context';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import MoviesPage from './pages/MoviesPage';
import WatchlistPage from './pages/WatchlistPage';
import { WatchlistProvider } from './WatchlistProvider';

// Only rendered when logged in, so the watchlist state resets on logout
function Layout() {
  return (
    <WatchlistProvider>
      <Navbar />
      <Outlet />
    </WatchlistProvider>
  );
}

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route element={token ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<MoviesPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}