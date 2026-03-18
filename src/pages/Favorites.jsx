import React, { useState, useEffect } from 'react'
import { getAnimeById } from '../services/api'
import AnimeCard from '../components/AnimeCard'
import Loader from '../components/Loader'
import './Favorites.css'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [anime, setAnime] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(ids)
    if (ids.length === 0) return
    setLoading(true)
    Promise.allSettled(ids.map(id => getAnimeById(id)))
      .then(results => {
        const loaded = results
          .filter(r => r.status === 'fulfilled' && r.value)
          .map(r => r.value)
        setAnime(loaded)
      })
      .finally(() => setLoading(false))
  }, [])

  const clearAll = () => {
    localStorage.removeItem('favorites')
    setFavorites([])
    setAnime([])
  }

  return (
    <div className="favorites">
      <div className="favorites__header">
        <div className="favorites__header-inner">
          <div className="favorites__badge">♥ My List</div>
          <div className="favorites__title-row">
            <h1 className="favorites__title">Favorites</h1>
            {favorites.length > 0 && (
              <button className="favorites__clear-btn" onClick={clearAll}>
                Clear All
              </button>
            )}
          </div>
          <p className="favorites__sub">{favorites.length} anime saved</p>
        </div>
      </div>

      <div className="favorites__content">
        {loading ? (
          <Loader count={favorites.length || 6} />
        ) : favorites.length === 0 ? (
          <div className="favorites__empty">
            <div className="favorites__empty-icon">( ˘³˘)</div>
            <h3>No favorites yet</h3>
            <p>Browse anime and click the heart icon to save titles here.</p>
          </div>
        ) : (
          <div className="favorites__grid">
            {anime.map(a => (
              <AnimeCard key={a.mal_id} anime={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
