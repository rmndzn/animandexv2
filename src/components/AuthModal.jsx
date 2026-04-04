import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './AuthModal.css'

export default function AuthModal({ onClose }) {
  const { login } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRegisterUnavailable, setShowRegisterUnavailable] = useState(false)
  const [innerVisible, setInnerVisible] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Trigger enter animation after mount
  useEffect(() => {
    if (showRegisterUnavailable) {
      requestAnimationFrame(() => setInnerVisible(true))
    } else {
      setInnerVisible(false)
    }
  }, [showRegisterUnavailable])

  const closeRegisterModal = () => {
    setInnerVisible(false)
    setTimeout(() => setShowRegisterUnavailable(false), 280)
  }

  // ESC key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (showRegisterUnavailable) {
          closeRegisterModal()
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
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setShowRegisterUnavailable(true)}
            >
              Register
            </button>
          </p>
        </form>

        {/* REGISTER UNAVAILABLE MODAL */}
        {showRegisterUnavailable && (
          <div
            className={`reg-overlay ${innerVisible ? 'reg-overlay--visible' : ''}`}
            onClick={closeRegisterModal}
          >
            <div
              className={`reg-box ${innerVisible ? 'reg-box--visible' : ''}`}
              onClick={e => e.stopPropagation()}
            >
              {/* Decorative top glow bar */}
              <div className="reg-box__glow-bar" />

              {/* Animated lock icon */}
              <div className="reg-box__icon-wrap">
                <div className="reg-box__icon-ring reg-box__icon-ring--outer" />
                <div className="reg-box__icon-ring reg-box__icon-ring--inner" />
                <span className="reg-box__icon">🔒</span>
              </div>

              {/* Badge */}
              <span className="reg-box__badge">Access Restricted</span>

              <h3 className="reg-box__title">Registration Unavailable</h3>

              <p className="reg-box__desc">
                New account creation is temporarily disabled.
                Reach out to an admin or check back later to get access.
              </p>

              {/* OK button */}
              <button
                className="reg-box__ok"
                onClick={closeRegisterModal}
              >
                Got it
              </button>

              {/* Shimmer line */}
              <div className="reg-box__shimmer" />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
