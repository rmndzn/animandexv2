import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AnimeCard.css'

const FALLBACK_IMG = 'https://via.placeholder.com/225x320/111120/ff6b1a?text=No+Image'

export default function AnimeCard({ anime }) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  const [favorited, setFavorited] = useState(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    return favs.includes(anime.mal_id)
  })

  const imgSrc = imgError
    ? FALLBACK_IMG
    : (anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || FALLBACK_IMG)

  const title = anime.title_english || anime.title || 'Unknown Title'
  const score = anime.score ? anime.score.toFixed(1) : 'N/A'
  const year = anime.year || (anime.aired?.prop?.from?.year) || ''
  const studio = anime.studios?.[0]?.name || ''
  const episodes = anime.episodes ? `${anime.episodes} eps` : 'Ongoing'
  const genres = (anime.genres || []).slice(0, 3)

  const toggleFav = (e) => {
    e.stopPropagation()
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    const idx = favs.indexOf(anime.mal_id)
    if (idx === -1) favs.push(anime.mal_id)
    else favs.splice(idx, 1)
    localStorage.setItem('favorites', JSON.stringify(favs))
    setFavorited(idx === -1)
  }

  const scoreClass = score >= 8 ? 'score--high' : score >= 6 ? 'score--mid' : 'score--low'

  return (
    <article
      className="anime-card"
      onClick={() => navigate(`/anime/${anime.mal_id}`)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/anime/${anime.mal_id}`)}
      role="button"
      aria-label={`View ${title}`}
    >
      <div className="anime-card__poster-wrap">
        <img
          src={imgSrc}
          alt={title}
          className="anime-card__poster"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="anime-card__poster-overlay" />

        {score !== 'N/A' && (
          <div className={`anime-card__score ${scoreClass}`}>
            ★ {score}
          </div>
        )}

        <button
          className={`anime-card__fav ${favorited ? 'anime-card__fav--active' : ''}`}
          onClick={toggleFav}
          aria-label="Toggle favorite"
        >
          {favorited ? '♥' : '♡'}
        </button>

        <div className="anime-card__hover-info">
          <div className="anime-card__episodes">{episodes}</div>
          {studio && <div className="anime-card__studio-hover">{studio}</div>}
        </div>
      </div>

      <div className="anime-card__body">
        <h3 className="anime-card__title">{title}</h3>

        {(genres.length > 0 || year) && (
          <div className="anime-card__meta">
            {year && <span className="anime-card__year">{year}</span>}
            {genres.map(g => (
              <span key={g.mal_id} className="anime-card__genre">{g.name}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
