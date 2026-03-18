// services/api.js — Jikan API v4 integration
const BASE_URL = 'https://api.jikan.moe/v4'

// Jikan has rate limits (3 req/s), add small delay helper
const delay = (ms) => new Promise(res => setTimeout(res, ms))

// Generic fetcher with error handling
async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data
}

// Search anime with optional query, genre, page
export async function searchAnime({ query = '', genre = '', page = 1 } = {}) {
  let url = `${BASE_URL}/anime?page=${page}&limit=24&sfw=true`
  if (query) url += `&q=${encodeURIComponent(query)}`
  if (genre) url += `&genres=${genre}`
  if (!query && !genre) url += `&order_by=score&sort=desc`
  const data = await fetchJSON(url)
  return {
    anime: data.data || [],
    pagination: data.pagination || {}
  }
}

// Get top anime (for initial hero / featured)
export async function getTopAnime(page = 1) {
  const data = await fetchJSON(`${BASE_URL}/top/anime?page=${page}&limit=24&type=tv`)
  return {
    anime: data.data || [],
    pagination: data.pagination || {}
  }
}

// Get single anime by ID
export async function getAnimeById(id) {
  const data = await fetchJSON(`${BASE_URL}/anime/${id}/full`)
  return data.data || null
}

// Get all genres
export async function getGenres() {
  const data = await fetchJSON(`${BASE_URL}/genres/anime`)
  return data.data || []
}

// Get seasonal anime
export async function getSeasonalAnime() {
  const data = await fetchJSON(`${BASE_URL}/seasons/now?limit=12`)
  return data.data || []
}

// Get anime recommendations based on id
export async function getAnimeRecommendations(id) {
  const data = await fetchJSON(`${BASE_URL}/anime/${id}/recommendations`)
  return (data.data || []).slice(0, 6)
}

// Extract unique studios from anime array
export function extractStudios(animeList) {
  const studios = new Map()
  animeList.forEach(anime => {
    const producers = anime.studios || anime.producers || []
    producers.forEach(s => {
      if (!studios.has(s.mal_id)) {
        studios.set(s.mal_id, { id: s.mal_id, name: s.name })
      }
    })
  })
  return Array.from(studios.values()).sort((a, b) => a.name.localeCompare(b.name))
}
