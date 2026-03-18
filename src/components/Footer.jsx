import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copy">
        © 2026 AnimanDex — Made by{' '}
        <a
          href="https://github.com/rmndzn"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__link"
        >
          rmndzn
        </a>
        . All rights reserved. · Powered by{' '}
        <a
          href="https://jikan.moe"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__link"
        >
          Jikan API
        </a>
      </p>
    </footer>
  )
}
