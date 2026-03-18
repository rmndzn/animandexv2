import React from 'react'
import './Filter.css'

export default function StudioFilter({ studios, selected, onChange }) {
  return (
    <div className="filter">
      <label className="filter__label">Studio</label>
      <div className="filter__select-wrap">
        <select
          className="filter__select"
          value={selected}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">All Studios</option>
          {studios.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <span className="filter__chevron">▾</span>
      </div>
    </div>
  )
}
