import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, getRank, getNextRank, RANKS } from '../context/AuthContext'
import './Profile.css'

const STATUS_TABS = [
  { value: 'all',          label: 'All',           icon: '◈' },
  { value: 'watching',     label: 'Watching',      icon: '▶' },
  { value: 'completed',    label: 'Completed',     icon: '✓' },
  { value: 'plan_to_watch',label: 'Plan to Watch', icon: '📋' },
  { value: 'dropped',      label: 'Dropped',       icon: '✕' },
]

const STATUS_COLORS = {
  watching:      '#38bdf8',
  completed:     '#4ade80',
  plan_to_watch: '#a78bfa',
  dropped:       '#f87171',
}

const STATUS_LABELS = {
  watching:      'Watching',
  completed:     'Completed',
  plan_to_watch: 'Plan to Watch',
  dropped:       'Dropped',
}

export default function Profile() {
  const { user, profile, animeList, removeAnimeFromList } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [removing, setRemoving]   = useState(null)

  if (!user) {
    return (
      <div className="profile-gate">
        <div className="profile-gate__icon">◈</div>
        <h2 className="profile-gate__title">You're not logged in</h2>
        <p className="profile-gate__sub">Login to track your anime list and earn ranks.</p>
        <Link to="/" className="profile-gate__btn">← Back to Home</Link>
      </div>
    )
  }

  const rank      = getRank(animeList.length)
  const nextRank  = getNextRank(animeList.length)
  const progress  = nextRank
    ? Math.min(((animeList.length - rank.min) / (nextRank.min - rank.min)) * 100, 100)
    : 100

  const counts = {
    all:           animeList.length,
    watching:      animeList.filter(a => a.status === 'watching').length,
    completed:     animeList.filter(a => a.status === 'completed').length,
    plan_to_watch: animeList.filter(a => a.status === 'plan_to_watch').length,
    dropped:       animeList.filter(a => a.status === 'dropped').length,
  }

  const displayed = activeTab === 'all'
    ? animeList
    : animeList.filter(a => a.status === activeTab)

  const handleRemove = async (animeId) => {
    setRemoving(animeId)
    try { await removeAnimeFromList(animeId) }
    catch (e) { console.error(e) }
    finally { setRemoving(null) }
  }

  const username = profile?.username || user.email?.split('@')[0] || 'User'
  const initial  = username[0].toUpperCase()

  return (
    <div className="profile">
      {/* Hero banner */}
      <div className="profile__banner">
        <div className="profile__banner-glow" />
        <div className="profile__banner-inner">
          <div className="profile__avatar">
            <span className="profile__avatar-letter">{initial}</span>
          </div>
          <div className="profile__identity">
            <h1 className="profile__username">{username}</h1>
            <div className="profile__rank-badge" style={{ color: rank.color, borderColor: `${rank.color}33`, background: `${rank.color}11` }}>
              {rank.icon} {rank.label}
            </div>
          </div>
        </div>

        {/* Rank progress */}
        <div className="profile__rank-section">
          <div className="profile__rank-row">
            <div className="profile__rank-current">
              <span style={{ color: rank.color }}>{rank.icon}</span>
              <span>{rank.label}</span>
            </div>
            {nextRank && (
              <div className="profile__rank-next">
                <span>{animeList.length} / {nextRank.min} anime to</span>
                <span style={{ color: nextRank.color }}>{nextRank.icon} {nextRank.label}</span>
              </div>
            )}
          </div>
          <div className="profile__rank-bar">
            <div
              className="profile__rank-fill"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${rank.color}, ${nextRank?.color || rank.color})` }}
            />
          </div>

          {/* All ranks */}
          <div className="profile__all-ranks">
            {RANKS.map(r => (
              <div
                key={r.id}
                className={`profile__rank-pip ${animeList.length >= r.min ? 'profile__rank-pip--unlocked' : ''} ${r.id === rank.id ? 'profile__rank-pip--active' : ''}`}
                title={`${r.label} — ${r.min}+ anime`}
                style={animeList.length >= r.min ? { color: r.color } : {}}
              >
                {r.icon}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="profile__stats">
          {STATUS_TABS.slice(1).map(t => (
            <div key={t.value} className="profile__stat">
              <span className="profile__stat-num" style={{ color: STATUS_COLORS[t.value] }}>{counts[t.value]}</span>
              <span className="profile__stat-label">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Anime list */}
      <div className="profile__content">
        {/* Tabs */}
        <div className="profile__tabs">
          {STATUS_TABS.map(t => (
            <button
              key={t.value}
              className={`profile__tab ${activeTab === t.value ? 'profile__tab--active' : ''}`}
              onClick={() => setActiveTab(t.value)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              <span className="profile__tab-count">{counts[t.value]}</span>
            </button>
          ))}
        </div>

        {/* List */}
        {displayed.length === 0 ? (
          <div className="profile__empty">
            <div className="profile__empty-icon">( ˘³˘)</div>
            <p>No anime in this category yet.</p>
            <Link to="/" className="profile__empty-btn">Browse Anime</Link>
          </div>
        ) : (
          <div className="profile__list">
            {displayed.map(entry => (
              <div key={entry.id} className="profile__entry">
                <div className="profile__entry-left">
                  <div
                    className="profile__entry-img-wrap"
                    onClick={() => navigate(`/anime/${entry.anime_id}`)}
                  >
                    {entry.anime_image ? (
                      <img
                        src={entry.anime_image}
                        alt={entry.anime_title}
                        className="profile__entry-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="profile__entry-img-fallback">◈</div>
                    )}
                  </div>
                  <div className="profile__entry-info">
                    <Link to={`/anime/${entry.anime_id}`} className="profile__entry-title">
                      {entry.anime_title}
                    </Link>
                    {entry.anime_score && (
                      <span className="profile__entry-score">★ {entry.anime_score}</span>
                    )}
                    <span
                      className="profile__entry-status"
                      style={{ color: STATUS_COLORS[entry.status] }}
                    >
                      {STATUS_LABELS[entry.status]}
                    </span>
                  </div>
                </div>
                <button
                  className="profile__entry-remove"
                  onClick={() => handleRemove(entry.anime_id)}
                  disabled={removing === entry.anime_id}
                  aria-label="Remove from list"
                >
                  {removing === entry.anime_id ? (
                    <span className="profile__remove-spinner" />
                  ) : '✕'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
