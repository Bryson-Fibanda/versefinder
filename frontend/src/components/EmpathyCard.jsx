import React from 'react'
import './EmpathyCard.css'

export default function EmpathyCard({ text }) {
  return (
    <div className="empathy-wrap animate-fade-up">
      <span className="empathy-label">He hears you</span>
      <p className="empathy-text">{text}</p>
    </div>
  )
}
