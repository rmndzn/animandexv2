import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AnimeDetail from './pages/AnimeDetail'
import TopAnime from './pages/TopAnime'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'

export default function App() {
  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/anime/:id"  element={<AnimeDetail />} />
            <Route path="/top"        element={<TopAnime />} />
            <Route path="/favorites"  element={<Favorites />} />
            <Route path="/profile"    element={<Profile />} />
            <Route path="*"           element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      textAlign: 'center',
      paddingTop: 'var(--nav-height)',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-display)'
    }}>
      <div style={{ fontSize: '4rem', opacity: 0.3 }}>404</div>
      <h2 style={{ color: 'var(--text-secondary)', fontSize: '1.4rem', fontWeight: 700 }}>
        Page Not Found
      </h2>
      <a href="/" style={{ color: 'var(--orange-bright)', fontSize: '0.875rem' }}>
        ← Back to Home
      </a>
    </div>
  )
}
