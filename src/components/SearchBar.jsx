import React, { useState, useCallback, useRef } from 'react'
import './SearchBar.css'

export default function SearchBar({ onSearch, value }) {
  const [focused, setFocused] = useState(false)
  const timerRef = useRef(null)

  const handleChange = useCallback((e) => {
    const val = e.target.value
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onSearch(val)
    }, 500)
  }, [onSearch])

  return (
    <div className={`search-bar ${focused ? 'search-bar--focused' : ''}`}>
      <span className="search-bar__icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      <input
        className="search-bar__input"
        type="text"
        placeholder="Search anime, e.g. Naruto, One Piece…"
        defaultValue={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button className="search-bar__clear" onClick={() => onSearch('')} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  )
}
