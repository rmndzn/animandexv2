import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth, getRank } from '../context/AuthContext'
import AuthModal from './AuthModal'
import './Navbar.css'

export default function Navbar() {
  const { user, profile, animeList, logout } = useAuth()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [authModal, setAuthModal] = useState(null)
  const [userMenu, setUserMenu]   = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const rank    = getRank(animeList.length)
  const initial = (profile?.username || user?.email || '?')[0].toUpperCase()

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">◈</span>
            <span className="navbar__logo-text">
              Animan<span className="navbar__logo-accent">Dex</span>
            </span>
          </Link>

          <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
            <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>
              Home
            </Link>
            <Link to="/top" className={`navbar__link ${location.pathname === '/top' ? 'navbar__link--active' : ''}`}>
              Top Anime
            </Link>

            {user ? (
              <>
                <Link to="/profile" className={`navbar__link ${location.pathname === '/profile' ? 'navbar__link--active' : ''}`}>
                  My List
                </Link>
                <div className="navbar__user-wrap">
                  <button
                    className="navbar__avatar"
                    onClick={() => setUserMenu(o => !o)}
                    aria-label="User menu"
                  >
                    <span className="navbar__avatar-letter">{initial}</span>
                    <span className="navbar__avatar-rank" style={{ color: rank.color }}>{rank.icon}</span>
                  </button>

                  {userMenu && (
                    <>
                      <div className="navbar__user-backdrop" onClick={() => setUserMenu(false)} />
                      <div className="navbar__user-menu">
                        <div className="navbar__user-info">
                          <span className="navbar__user-name">{profile?.username || 'User'}</span>
                          <span className="navbar__user-rank" style={{ color: rank.color }}>
                            {rank.icon} {rank.label}
                          </span>
                          <span className="navbar__user-count">{animeList.length} anime tracked</span>
                        </div>
                        <Link to="/profile" className="navbar__user-link" onClick={() => setUserMenu(false)}>
                          My Anime List
                        </Link>
                        <button className="navbar__logout" onClick={() => { logout(); setUserMenu(false) }}>
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button className="navbar__login-btn" onClick={() => setAuthModal('login')}>
                Login
              </button>
            )}
          </div>

          <button
            className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {authModal && <AuthModal onClose={() => setAuthModal(null)} defaultTab={authModal} />}
    </>
  )
}
