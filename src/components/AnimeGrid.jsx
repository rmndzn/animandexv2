import React from 'react'
import AnimeCard from './AnimeCard'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'
import './AnimeGrid.css'

export default function AnimeGrid({ anime, loading, error, onRetry, emptyMessage }) {
  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />

  if (!anime || anime.length === 0) {
    return (
      <div className="anime-grid__empty">
        <div className="anime-grid__empty-icon">( ×_× )</div>
        <h3 className="anime-grid__empty-title">No Anime Found</h3>
        <p className="anime-grid__empty-text">
          {emptyMessage || 'Try a different search term or adjust the filters.'}
        </p>
      </div>
    )
  }

  return (
    <div className="anime-grid">
      {anime.map(a => (
        <AnimeCard key={a.mal_id} anime={a} />
      ))}
    </div>
  )
}
