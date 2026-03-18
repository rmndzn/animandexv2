import React, { useState, useEffect, useCallback } from 'react'
import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar'
import GenreFilter from '../components/GenreFilter'
import StudioFilter from '../components/StudioFilter'
import AnimeGrid from '../components/AnimeGrid'
import { searchAnime, getTopAnime, getGenres, extractStudios } from '../services/api'
import './Home.css'

const SORT_OPTIONS = [
  { value: 'score', label: 'Top Rated' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rank', label: 'Ranking' },
]

export default function Home() {
  const [anime, setAnime] = useState([])
  const [genres, setGenres] = useState([])
  const [studios, setStudios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [studio, setStudio] = useState('')
  const [sort, setSort] = useState('score')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})

  // Load genres once
  useEffect(() => {
    getGenres().then(setGenres).catch(console.warn)
  }, [])

  // Fetch anime whenever query/genre/sort/page changes
  const fetchAnime = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let result
      if (query || genre) {
        result = await searchAnime({ query, genre, page })
      } else {
        result = await getTopAnime(page)
      }
      setAnime(result.anime)
      setPagination(result.pagination)
      // Extract studios from fetched data
      setStudios(prev => {
        const newStudios = extractStudios(result.anime)
        const merged = new Map([...prev.map(s => [s.id, s]), ...newStudios.map(s => [s.id, s])])
        return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name))
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [query, genre, page])

  useEffect(() => {
    fetchAnime()
  }, [fetchAnime])

  // Front-end studio filter applied on top of fetched data
  const displayAnime = studio
    ? anime.filter(a => {
        const studioId = parseInt(studio)
        return (a.studios || []).some(s => s.mal_id === studioId) ||
               (a.producers || []).some(s => s.mal_id === studioId)
      })
    : anime

  // Sort front-end (secondary sort since API already does primary)
  const sortedAnime = [...displayAnime].sort((a, b) => {
    if (sort === 'score') return (b.score || 0) - (a.score || 0)
    if (sort === 'popularity') return (a.popularity || 9999) - (b.popularity || 9999)
    if (sort === 'rank') return (a.rank || 9999) - (b.rank || 9999)
    return 0
  })

  const handleSearch = (val) => {
    setQuery(val)
    setPage(1)
  }

  const handleGenre = (val) => {
    setGenre(val)
    setPage(1)
  }

  const handleReset = () => {
    setQuery('')
    setGenre('')
    setStudio('')
    setSort('score')
    setPage(1)
  }

  const hasFilters = query || genre || studio || sort !== 'score'

  const hasNextPage = pagination?.has_next_page
  const hasPrevPage = page > 1

  return (
    <div className="home">
      <Hero />

      <main className="home__main">
        {/* Controls bar */}
        <section className="home__controls">
          <div className="home__search-row">
            <SearchBar onSearch={handleSearch} value={query} />
          </div>

          <div className="home__filters-row">
            <GenreFilter genres={genres} selected={genre} onChange={handleGenre} />
            <StudioFilter studios={studios} selected={studio} onChange={setStudio} />

            <div className="home__sort">
              <label className="filter__label">Sort By</label>
              <div className="filter__select-wrap">
                <select
                  className="filter__select"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className="filter__chevron">▾</span>
              </div>
            </div>

            {hasFilters && (
              <button className="home__reset-btn" onClick={handleReset}>
                ✕ Reset
              </button>
            )}
          </div>
        </section>

        {/* Results header */}
        {!loading && !error && (
          <div className="home__results-header">
            <h2 className="home__section-title">
              {query ? `Results for "${query}"` : genre ? 'Filtered Results' : 'Top Anime'}
            </h2>
            <span className="home__results-count">
              {sortedAnime.length} titles shown
            </span>
          </div>
        )}

        {/* Grid */}
        <AnimeGrid
          anime={sortedAnime}
          loading={loading}
          error={error}
          onRetry={fetchAnime}
        />

        {/* Pagination */}
        {!loading && !error && sortedAnime.length > 0 && (
          <div className="home__pagination">
            <button
              className="home__page-btn"
              onClick={() => setPage(p => p - 1)}
              disabled={!hasPrevPage}
            >
              ← Previous
            </button>
            <span className="home__page-indicator">Page {page}</span>
            <button
              className="home__page-btn"
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNextPage}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
