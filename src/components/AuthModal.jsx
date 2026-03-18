import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './AuthModal.css'

export default function AuthModal({ onClose, defaultTab = 'login' }) {
  const { login, register } = useAuth()
  const [tab, setTab]         = useState(defaultTab)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  // Form fields
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [confirm, setConfirm]   = useState('')

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const reset = () => {
    setError(''); setSuccess('')
    setEmail(''); setPassword(''); setUsername(''); setConfirm('')
  }

  const switchTab = (t) => { setTab(t); reset() }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email, password)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (username.length < 3) { setError('Username must be at least 3 characters'); return }
    setLoading(true)
    try {
      await register(email, password, username)
      setSuccess('Account created! Check your email to confirm, then log in.')
      setTab('login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-modal" onClick={onClose}>
      <div className="auth-modal__box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal__header">
          <div className="auth-modal__logo">
            <span className="auth-modal__logo-icon">◈</span>
            Animan<span className="auth-modal__logo-accent">Dex</span>
          </div>
          <button className="auth-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="auth-modal__tabs">
          <button
            className={`auth-modal__tab ${tab === 'login' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button
            className={`auth-modal__tab ${tab === 'register' ? 'auth-modal__tab--active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Register
          </button>
        </div>

        {/* Alerts */}
        {error   && <div className="auth-modal__alert auth-modal__alert--error">⚠ {error}</div>}
        {success && <div className="auth-modal__alert auth-modal__alert--success">✓ {success}</div>}

        {/* Login form */}
        {tab === 'login' && (
          <form className="auth-modal__form" onSubmit={handleLogin}>
            <div className="auth-modal__field">
              <label>Email</label>
              <input
                type="email" required placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-modal__field">
              <label>Password</label>
              <input
                type="password" required placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className="auth-modal__submit" type="submit" disabled={loading}>
              {loading ? <span className="auth-modal__spinner" /> : 'Login'}
            </button>
            <p className="auth-modal__switch">
              Don't have an account?{' '}
              <button type="button" onClick={() => switchTab('register')}>Register</button>
            </p>
          </form>
        )}

        {/* Register form */}
        {tab === 'register' && (
          <form className="auth-modal__form" onSubmit={handleRegister}>
            <div className="auth-modal__field">
              <label>Username</label>
              <input
                type="text" required placeholder="YourUsername" minLength={3}
                value={username} onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="auth-modal__field">
              <label>Email</label>
              <input
                type="email" required placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-modal__field">
              <label>Password</label>
              <input
                type="password" required placeholder="••••••••" minLength={6}
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="auth-modal__field">
              <label>Confirm Password</label>
              <input
                type="password" required placeholder="••••••••"
                value={confirm} onChange={e => setConfirm(e.target.value)}
              />
            </div>
            <button className="auth-modal__submit" type="submit" disabled={loading}>
              {loading ? <span className="auth-modal__spinner" /> : 'Create Account'}
            </button>
            <p className="auth-modal__switch">
              Already have an account?{' '}
              <button type="button" onClick={() => switchTab('login')}>Login</button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
