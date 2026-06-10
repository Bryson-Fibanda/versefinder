import React, { useState } from 'react'
import { BookOpen, Lightbulb, Heart, ChevronDown, ChevronUp, RotateCcw, Copy, Check } from 'lucide-react'
import './GuidanceResult.css'

function VerseCard({ verse, index }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  function copy() {
    const text = `${verse.reference}\n"${verse.text}"\n\n${verse.explanation}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={`verse-card animate-fade-up delay-${index + 1}`}>
      <div className="verse-header" onClick={() => setExpanded(e => !e)}>
        <div className="verse-ref-row">
          <span className="verse-number">{index + 1}</span>
          <span className="verse-ref">{verse.reference}</span>
        </div>
        <div className="verse-header-actions">
          <button className="copy-btn" onClick={e => { e.stopPropagation(); copy() }} aria-label="Copy verse">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {verse.text && (
        <blockquote className="verse-text">
          {verse.text}
          {verse.translation && (
            <cite className="verse-translation">{verse.translation}</cite>
          )}
        </blockquote>
      )}

      {expanded && (
        <div className="verse-explanation animate-fade-in">
          <p>{verse.explanation}</p>
        </div>
      )}

      {!expanded && (
        <p className="verse-explanation-preview">{verse.explanation}</p>
      )}
    </div>
  )
}

export default function GuidanceResult({ result, onReset }) {
  const [prayerCopied, setPrayerCopied] = useState(false)

  function copyPrayer() {
    navigator.clipboard.writeText(result.prayer).then(() => {
      setPrayerCopied(true)
      setTimeout(() => setPrayerCopied(false), 2000)
    })
  }

  return (
    <div className="result-wrap">
      {/* Empathy */}
      <div className="empathy-card animate-fade-up">
        <p className="empathy-text">{result.empathy}</p>
      </div>

      {/* Verses */}
      <section className="result-section">
        <div className="section-header">
          <BookOpen size={16} strokeWidth={1.5} />
          <h2 className="section-title">The Word for You</h2>
        </div>
        <div className="verses-list">
          {result.verses?.map((v, i) => (
            <VerseCard key={i} verse={v} index={i} />
          ))}
        </div>
      </section>

      {/* Advice */}
      {result.advice?.length > 0 && (
        <section className="result-section animate-fade-up delay-4">
          <div className="section-header">
            <Lightbulb size={16} strokeWidth={1.5} />
            <h2 className="section-title">Practical Steps</h2>
          </div>
          <div className="advice-card">
            {result.advice.map((step, i) => (
              <div key={i} className="advice-step">
                <span className="advice-num">{i + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Prayer */}
      {result.prayer && (
        <section className="result-section animate-fade-up delay-5">
          <div className="section-header">
            <Heart size={16} strokeWidth={1.5} />
            <h2 className="section-title">A Prayer for You</h2>
          </div>
          <div className="prayer-card">
            <p className="prayer-text">{result.prayer}</p>
            <button className="prayer-copy" onClick={copyPrayer}>
              {prayerCopied ? <Check size={14} /> : <Copy size={14} />}
              {prayerCopied ? 'Copied' : 'Copy prayer'}
            </button>
          </div>
        </section>
      )}

      {/* Reset */}
      <button className="reset-btn animate-fade-up" onClick={onReset}>
        <RotateCcw size={15} />
        Ask another question
      </button>
    </div>
  )
}
