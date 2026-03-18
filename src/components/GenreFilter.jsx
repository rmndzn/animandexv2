import React from 'react'
import './Filter.css'

export default function GenreFilter({ genres, selected, onChange }) {
  return (
    <div className="filter">
      <label className="filter__label">Genre</label>
      <div className="filter__select-wrap">
        <select
          className="filter__select"
          value={selected}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g.mal_id} value={g.mal_id}>{g.name}</option>
          ))}
        </select>
        <span className="filter__chevron">▾</span>
      </div>
    </div>
  )
}
