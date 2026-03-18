import React from 'react'
import './ErrorMessage.css'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <div className="error-message__icon">⚠</div>
      <h3 className="error-message__title">Something went wrong</h3>
      <p className="error-message__text">
        {message || 'Failed to load anime data. The API may be rate-limited — please wait a moment and try again.'}
      </p>
      {onRetry && (
        <button className="error-message__btn" onClick={onRetry}>
          ↺ Try Again
        </button>
      )}
    </div>
  )
}
