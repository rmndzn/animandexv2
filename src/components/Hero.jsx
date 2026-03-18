import React from 'react'
import './Hero.css'

export default function Hero({ featuredAnime }) {
  const bg = featuredAnime?.images?.jpg?.large_image_url

  return (
    <section className="hero" style={bg ? { '--hero-bg': `url(${bg})` } : {}}>
      <div className="hero__bg-blur" />
      <div className="hero__orbs">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
      </div>

      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          AnimanDex
        </div>
        <h1 className="hero__title">
          Discover Your Next
          <br />
          <span className="hero__title-accent">Anime Obsession</span>
        </h1>
        <p className="hero__subtitle">
          Search thousands of titles, explore genres, track your favorites — all with a slick glass-dark aesthetic.
        </p>
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-num">30K+</span>
            <span className="hero__stat-label">Anime Titles</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">100+</span>
            <span className="hero__stat-label">Genres</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">Live</span>
            <span className="hero__stat-label">Data via Jikan API</span>
          </div>
        </div>
      </div>
    </section>
  )
}
