import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// ─── Rank system ─────────────────────────────────────────────
export const RANKS = [
  { id: 'newbie',         label: 'Newbie',          min: 0,   icon: '🌱', color: '#6ee7b7' },
  { id: 'fan',            label: 'Anime Fan',        min: 5,   icon: '⭐', color: '#fcd34d' },
  { id: 'weeb',           label: 'Weeb',             min: 15,  icon: '🌸', color: '#f9a8d4' },
  { id: 'otaku',          label: 'Otaku',            min: 30,  icon: '🔥', color: '#fb923c' },
  { id: 'hardcore',       label: 'Hardcore Otaku',   min: 60,  icon: '⚡', color: '#c084fc' },
  { id: 'veteran',        label: 'Veteran Otaku',    min: 100, icon: '💎', color: '#38bdf8' },
  { id: 'otaku_master',   label: 'Otaku Master',     min: 200, icon: '👑', color: '#ff6b1a' },
]

export function getRank(totalAnime = 0) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (totalAnime >= r.min) rank = r
  }
  return rank
}

export function getNextRank(totalAnime = 0) {
  const idx = RANKS.findIndex(r => r.min > totalAnime)
  return idx === -1 ? null : RANKS[idx]
}

// ─── Provider ────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [profile, setProfile]   = useState(null)
  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading]   = useState(true)

  // Fetch profile row
  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data || null)
  }, [])

  // Fetch the user's full anime list
  const fetchAnimeList = useCallback(async (userId) => {
    const { data } = await supabase
      .from('anime_list')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    setAnimeList(data || [])
  }, [])

  // Sync session on mount + auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        fetchProfile(u.id)
        fetchAnimeList(u.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        fetchProfile(u.id)
        fetchAnimeList(u.id)
      } else {
        setProfile(null)
        setAnimeList([])
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile, fetchAnimeList])

  // ── Auth actions ──────────────────────────────────────────
  const register = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    })
    if (error) throw error
    return data
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  // ── Anime list actions ────────────────────────────────────
  const getAnimeStatus = (animeId) => {
    const entry = animeList.find(a => a.anime_id === animeId)
    return entry?.status ?? null
  }

  const setAnimeStatus = async (anime, status) => {
    if (!user) throw new Error('Not logged in')

    const payload = {
      user_id:     user.id,
      anime_id:    anime.mal_id,
      anime_title: anime.title_english || anime.title,
      anime_image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null,
      anime_score: anime.score || null,
      status,
      updated_at:  new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('anime_list')
      .upsert(payload, { onConflict: 'user_id,anime_id' })
      .select()
      .single()

    if (error) throw error

    setAnimeList(prev => {
      const idx = prev.findIndex(a => a.anime_id === anime.mal_id)
      if (idx !== -1) {
        const updated = [...prev]
        updated[idx] = data
        return updated
      }
      return [data, ...prev]
    })
  }

  const removeAnimeFromList = async (animeId) => {
    if (!user) throw new Error('Not logged in')

    const { error } = await supabase
      .from('anime_list')
      .delete()
      .eq('user_id', user.id)
      .eq('anime_id', animeId)

    if (error) throw error
    setAnimeList(prev => prev.filter(a => a.anime_id !== animeId))
  }

  const listByStatus = (status) => animeList.filter(a => a.status === status)

  const value = {
    user, profile, animeList, loading,
    register, login, logout,
    getAnimeStatus, setAnimeStatus, removeAnimeFromList, listByStatus,
    refreshList: () => user && fetchAnimeList(user.id),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
