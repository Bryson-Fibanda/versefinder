import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Copy, Check, Bookmark, BookmarkCheck, Share2 } from 'lucide-react'
import { saveItem, isAlreadySaved } from '../utils/storage.js'
import { shareVerse } from '../utils/share.js'
import './VerseCarousel.css'

export default function VerseCarousel({ verses }) {
  const [idx, setIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(() => verses.map(v => isAlreadySaved(v.reference)))
  const [shared, setShared] = useState(false)

  const verse = verses[idx]

  function prev() { setIdx(i => (i - 1 + verses.length) % verses.length) }
  function next() { setIdx(i => (i + 1) % verses.length) }

  function copy() {
    navigator.clipboard.writeText(`${verse.reference}\n"${verse.text}"`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function save() {
    if (saved[idx]) return
    saveItem({ type: 'verse', reference: verse.reference, text: verse.text, explanation: verse.explanation, translation: verse.translation })
    const next = [...saved]; next[idx] = true; setSaved(next)
  }

  async function share() {
    await shareVerse(verse)
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  return (
    <div className="verse-carousel animate-fade-up">
      {/* Tabs */}
      <div className="verse-tabs">
        {verses.map((v, i) => (
          <button key={i} className={`verse-tab ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)}>
            <span className="tab-num">{i + 1}</span>
            <span className="tab-ref">{v.reference.split(' ').slice(0, 2).join(' ')}</span>
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="verse-card animate-slide-in" key={idx}>
        <div className="verse-ref-row">
          <span className="verse-ref">{verse.reference}</span>
          {verse.translation && <span className="verse-trans">{verse.translation}</span>}
        </div>

        {verse.text && (
          <blockquote className="verse-text">"{verse.text}"</blockquote>
        )}

        <div className="verse-divider" />

        <p className="verse-explanation">{verse.explanation}</p>

        <div className="verse-actions">
          <button className="vaction-btn ripple" onClick={copy} title="Copy verse">
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button className={`vaction-btn ripple ${saved[idx] ? 'saved' : ''}`} onClick={save} title="Save verse">
            {saved[idx] ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            <span>{saved[idx] ? 'Saved' : 'Save'}</span>
          </button>
          <button className="vaction-btn ripple" onClick={share} title="Share verse">
            <Share2 size={15} />
            <span>{shared ? 'Shared' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="verse-nav">
        <button className="vnav-btn ripple" onClick={prev} disabled={verses.length < 2}>
          <ChevronLeft size={18} />
        </button>
        <span className="verse-counter">{idx + 1} of {verses.length}</span>
        <button className="vnav-btn ripple" onClick={next} disabled={verses.length < 2}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
