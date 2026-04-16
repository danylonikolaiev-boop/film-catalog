import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { FilmDetailsPage } from './pages/FilmDetailsPage/FilmDetailsPage';
import { CreateFilmPage } from './pages/CreateFilmPage/CreateFilmPage';
import { GenresPage } from './pages/GenresPage/GenresPage';

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
        
        <header style={{ 
          backgroundColor: '#ffffff', 
          borderBottom: '1px solid #eaeaea', 
          padding: '16px 32px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#111', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            MovieApp
          </Link>
          
          <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/genres" style={{ textDecoration: 'none', color: '#555', fontWeight: '500', transition: 'color 0.2s' }}>Жанри</Link>
          </nav>
        </header>

        <main style={{ padding: '32px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/films/:id" element={<FilmDetailsPage />} />
            <Route path="/create" element={<CreateFilmPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '50px' }}>404 - Сторінку не знайдено</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;