import React, { useState, useEffect } from 'react'
import './LoadingState.css'

const STEPS = ['Reading your heart...', 'Searching the scriptures...', 'Preparing your guidance...']

export default function LoadingState() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % STEPS.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="loading-wrap animate-fade-in">
      <div className="loading-cross">
        <div className="cross-h" /><div className="cross-v" />
        <div className="cross-glow" />
      </div>
      <p className="loading-step">{STEPS[step]}</p>
      <div className="loading-dots"><span /><span /><span /></div>
    </div>
  )
}
