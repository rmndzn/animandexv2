import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAnimeById, getAnimeRecommendations } from '../services/api'
import AnimeCard from '../components/AnimeCard'
import AnimeStatusButton from '../components/AnimeStatusButton'
import './AnimeDetail.css'

const FALLBACK_IMG = 'https://via.placeholder.com/400x566/111120/ff6b1a?text=No+Image'

function StatBadge({ label, value, highlight }) {
  return (
    <div className={`stat-badge ${highlight ? 'stat-badge--highlight' : ''}`}>
      <span className="stat-badge__label">{label}</span>
      <span className="stat-badge__value">{value ?? 'N/A'}</span>
    </div>
  )
}

export default function AnimeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [anime, setAnime] = useState(null)
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imgError, setImgError] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const [favorited, setFavorited] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    setError(null)
    setImgError(false)

    const load = async () => {
      try {
        const data = await getAnimeById(id)
        setAnime(data)
        const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
        setFavorited(favs.includes(data.mal_id))
        // Load recommendations
        const recData = await getAnimeRecommendations(id).catch(() => [])
        setRecs(recData.map(r => r.entry).filter(Boolean).slice(0, 6))
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const toggleFav = () => {
    if (!anime) return
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    const idx = favs.indexOf(anime.mal_id)
    if (idx === -1) favs.push(anime.mal_id)
    else favs.splice(idx, 1)
    localStorage.setItem('favorites', JSON.stringify(favs))
    setFavorited(idx === -1)
  }

  if (loading) return (
    <div className="detail-loading">
      <div className="detail-loading__spinner" />
      <p>Loading anime details…</p>
    </div>
  )

  if (error || !anime) return (
    <div className="detail-error">
      <div className="detail-error__icon">⚠</div>
      <h2>Failed to load anime</h2>
      <p>{error || 'Anime not found.'}</p>
      <button className="detail-back-btn" onClick={() => navigate(-1)}>← Go Back</button>
    </div>
  )

  const imgSrc = imgError
    ? FALLBACK_IMG
    : (anime.images?.jpg?.large_image_url || FALLBACK_IMG)

  const title = anime.title_english || anime.title
  const studios = (anime.studios || []).map(s => s.name).join(', ') || 'Unknown'
  const genres = anime.genres || []
  const themes = anime.themes || []
  const producers = (anime.producers || []).map(p => p.name).join(', ')

  return (
    <div className="detail">
      {/* Blurred backdrop */}
      <div
        className="detail__backdrop"
        style={{ backgroundImage: `url(${imgSrc})` }}
      />
      <div className="detail__backdrop-overlay" />

      <div className="detail__container">
        {/* Back */}
        <button className="detail-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Hero layout */}
        <div className="detail__hero">
          <div className="detail__poster-wrap">
            <img
              src={imgSrc}
              alt={title}
              className="detail__poster"
              onError={() => setImgError(true)}
            />
            {/* Action buttons */}
            <div className="detail__poster-actions">
              <AnimeStatusButton anime={anime} />
              {anime.trailer?.embed_url && (
                <button
                  className="detail__trailer-btn"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶ Watch Trailer
                </button>
              )}
            </div>
          </div>

          <div className="detail__info">
            <div className="detail__titles">
              <h1 className="detail__title">{title}</h1>
              {anime.title !== title && (
                <p className="detail__title-alt">{anime.title}</p>
              )}
              {anime.title_japanese && (
                <p className="detail__title-jp">{anime.title_japanese}</p>
              )}
            </div>

            {/* Stats */}
            <div className="detail__stats">
              <StatBadge label="Score" value={anime.score ? `★ ${anime.score}` : null} highlight />
              <StatBadge label="Rank" value={anime.rank ? `#${anime.rank}` : null} />
              <StatBadge label="Popularity" value={anime.popularity ? `#${anime.popularity}` : null} />
              <StatBadge label="Episodes" value={anime.episodes || 'Ongoing'} />
              <StatBadge label="Status" value={anime.status} />
              <StatBadge label="Year" value={anime.year || anime.aired?.prop?.from?.year} />
              <StatBadge label="Rating" value={anime.rating} />
              <StatBadge label="Duration" value={anime.duration} />
            </div>

            {/* Genres & Themes */}
            {(genres.length > 0 || themes.length > 0) && (
              <div className="detail__tags-section">
                <h3 className="detail__section-label">Genres & Themes</h3>
                <div className="detail__tags">
                  {genres.map(g => (
                    <span key={g.mal_id} className="detail__tag detail__tag--genre">{g.name}</span>
                  ))}
                  {themes.map(t => (
                    <span key={t.mal_id} className="detail__tag detail__tag--theme">{t.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Studio */}
            <div className="detail__meta-row">
              <div className="detail__meta-item">
                <span className="detail__meta-label">Studio</span>
                <span className="detail__meta-value">{studios}</span>
              </div>
              {producers && (
                <div className="detail__meta-item">
                  <span className="detail__meta-label">Producers</span>
                  <span className="detail__meta-value">{producers}</span>
                </div>
              )}
              {anime.source && (
                <div className="detail__meta-item">
                  <span className="detail__meta-label">Source</span>
                  <span className="detail__meta-value">{anime.source}</span>
                </div>
              )}
            </div>

            {/* Synopsis */}
            {anime.synopsis && (
              <div className="detail__synopsis-wrap">
                <h3 className="detail__section-label">Synopsis</h3>
                <p className="detail__synopsis">{anime.synopsis}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {recs.length > 0 && (
          <section className="detail__recs">
            <h2 className="detail__recs-title">You Might Also Like</h2>
            <div className="detail__recs-grid">
              {recs.map(r => (
                <AnimeCard key={r.mal_id} anime={r} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Trailer modal */}
      {showTrailer && anime.trailer?.embed_url && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal__inner" onClick={e => e.stopPropagation()}>
            <button className="trailer-modal__close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              src={anime.trailer.embed_url}
              title={`${title} Trailer`}
              allowFullScreen
              className="trailer-modal__iframe"
            />
          </div>
        </div>
      )}
    </div>
  )
}
