import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './AnimeStatusButton.css'

const STATUSES = [
  { value: 'watching',      label: 'Watching',       icon: '▶', color: 'blue'   },
  { value: 'completed',     label: 'Completed',      icon: '✓', color: 'green'  },
  { value: 'plan_to_watch', label: 'Plan to Watch',  icon: '📋', color: 'purple' },
  { value: 'dropped',       label: 'Dropped',        icon: '✕', color: 'red'    },
]

export default function AnimeStatusButton({ anime }) {
  const { user, getAnimeStatus, setAnimeStatus, removeAnimeFromList } = useAuth()
  const [open, setOpen]   = useState(false)
  const [loading, setLoading] = useState(false)

  const currentStatus = getAnimeStatus(anime?.mal_id)
  const current = STATUSES.find(s => s.value === currentStatus)

  if (!user) return null

  const handleSelect = async (status) => {
    setOpen(false)
    setLoading(true)
    try {
      if (status === currentStatus) {
        await removeAnimeFromList(anime.mal_id)
      } else {
        await setAnimeStatus(anime, status)
      }
    } catch (err) {
      console.error('Status update failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="status-btn-wrap">
      <button
        className={`status-btn ${current ? `status-btn--${current.color}` : 'status-btn--default'}`}
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {loading ? (
          <span className="status-btn__spinner" />
        ) : (
          <>
            <span className="status-btn__icon">{current?.icon ?? '+'}</span>
            <span className="status-btn__label">
              {current ? current.label : 'Add to List'}
            </span>
            <span className="status-btn__chevron">▾</span>
          </>
        )}
      </button>

      {open && (
        <>
          <div className="status-btn__backdrop" onClick={() => setOpen(false)} />
          <ul className="status-btn__dropdown" role="listbox">
            {STATUSES.map(s => (
              <li
                key={s.value}
                role="option"
                aria-selected={s.value === currentStatus}
                className={`status-btn__option status-btn__option--${s.color} ${s.value === currentStatus ? 'status-btn__option--active' : ''}`}
                onClick={() => handleSelect(s.value)}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
                {s.value === currentStatus && <span className="status-btn__check">✓</span>}
              </li>
            ))}
            {currentStatus && (
              <li
                className="status-btn__option status-btn__option--remove"
                onClick={() => handleSelect(currentStatus)}
              >
                <span>🗑</span>
                <span>Remove from List</span>
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  )
}
