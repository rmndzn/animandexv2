import React, { useState, useEffect } from 'react'
import { getTopAnime } from '../services/api'
import AnimeGrid from '../components/AnimeGrid'
import './TopAnime.css'

const TYPES = [
  { value: 'tv', label: 'TV Series' },
  { value: 'movie', label: 'Movies' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Specials' },
]

export default function TopAnime() {
  const [anime, setAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})

  const fetchTop = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getTopAnime(page)
      setAnime(result.anime)
      setPagination(result.pagination)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTop()
  }, [page])

  return (
    <div className="top-anime">
      <div className="top-anime__header">
        <div className="top-anime__header-inner">
          <div className="top-anime__badge">Top Charts</div>
          <h1 className="top-anime__title">Top Rated Anime</h1>
          <p className="top-anime__sub">The highest-scored anime of all time, ranked by the community.</p>
        </div>
      </div>

      <div className="top-anime__content">
        <AnimeGrid anime={anime} loading={loading} error={error} onRetry={fetchTop} />

        {!loading && !error && anime.length > 0 && (
          <div className="top-anime__pagination">
            <button
              className="top-anime__page-btn"
              onClick={() => setPage(p => p - 1)}
              disabled={page <= 1}
            >
              ← Prev
            </button>
            <span className="top-anime__page-num">Page {page}</span>
            <button
              className="top-anime__page-btn"
              onClick={() => setPage(p => p + 1)}
              disabled={!pagination?.has_next_page}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
