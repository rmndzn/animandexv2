import React from 'react'
import './Loader.css'

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__poster shimmer" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__title shimmer" />
        <div className="skeleton-card__title shimmer" style={{ width: '70%' }} />
        <div className="skeleton-card__tags">
          <div className="skeleton-card__tag shimmer" />
          <div className="skeleton-card__tag shimmer" />
        </div>
      </div>
    </div>
  )
}

export default function Loader({ count = 24 }) {
  return (
    <div className="loader-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
