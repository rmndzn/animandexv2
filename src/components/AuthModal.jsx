import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './AuthModal.css'

export default function AuthModal({ onClose }) {
  const { login } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRegisterUnavailable, setShowRegisterUnavailable] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ESC key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (showRegisterUnavailable) {
          setShowRegisterUnavailable(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, showRegisterUnavailable])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-modal" onClick={onClose}>
      <div className="auth-modal__box" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="auth-modal__header">
          <div className="auth-modal__logo">
            <span className="auth-modal__logo-icon">◈</span>
            Animan<span className="auth-modal__logo-accent">Dex</span>
          </div>
          <button className="auth-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* TABS */}
        <div className="auth-modal__tabs">
          <button className="auth-modal__tab auth-modal__tab--active">
            Login
          </button>

          <button
            className="auth-modal__tab auth-modal__tab--disabled"
            onClick={() => setShowRegisterUnavailable(true)}
          >
            Register
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="auth-modal__alert auth-modal__alert--error">
            ⚠ {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form className="auth-modal__form" onSubmit={handleLogin}>
          <div className="auth-modal__field">
            <label>Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-modal__field">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-modal__submit" type="submit" disabled={loading}>
            {loading ? <span className="auth-modal__spinner" /> : 'Login'}
          </button>

          <p className="auth-modal__switch">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={() => setShowRegisterUnavailable(true)}
            >
              Register
            </button>
          </p>
        </form>

        {/* REGISTER DISABLED MODAL */}
        {showRegisterUnavailable && (
          <div
            className="auth-modal__inner-overlay"
            onClick={() => setShowRegisterUnavailable(false)}
          >
            <div
              className="auth-modal__inner-box"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Registration Unavailable</h3>
              <p>
                Account registration is currently disabled.
                Please contact admin or try again later.
              </p>

              <button
                className="auth-modal__submit"
                onClick={() => setShowRegisterUnavailable(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
