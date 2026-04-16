import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { FilmDetailsPage } from './pages/FilmDetailsPage/FilmDetailsPage';
import { CreateFilmPage } from './pages/CreateFilmPage/CreateFilmPage';
import { GenresPage } from './pages/GenresPage/GenresPage';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header style={{ borderBottom: '1px solid black', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
            MovieApp
          </Link>
          
          <nav style={{ display: 'flex', gap: '15px' }}>
            <Link to="/genres" style={{ color: 'black' }}>Жанри</Link>
          </nav>
        </header>

        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/films/:id" element={<FilmDetailsPage />} />
            <Route path="/create" element={<CreateFilmPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="*" element={<div>404 - Не знайдено</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;