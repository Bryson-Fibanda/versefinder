import React from 'react'
import './AdviceCard.css'

export default function AdviceCard({ steps }) {
  return (
    <div className="advice-card animate-fade-up">
      <span className="advice-label">Practical Steps</span>
      {steps.map((step, i) => (
        <div key={i} className="advice-step">
          <span className="advice-num">{i + 1}</span>
          <p>{step}</p>
        </div>
      ))}
    </div>
  )
}
