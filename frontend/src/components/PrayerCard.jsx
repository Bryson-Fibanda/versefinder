import React, { useState } from 'react'
import { Copy, Check, Bookmark, BookmarkCheck } from 'lucide-react'
import { saveItem, isAlreadySaved } from '../utils/storage.js'
import './PrayerCard.css'

export default function PrayerCard({ prayer, context }) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(() => isAlreadySaved('prayer_' + prayer.slice(0, 20)))

  function copy() {
    navigator.clipboard.writeText(prayer)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function save() {
    if (saved) return
    saveItem({ type: 'prayer', reference: 'prayer_' + prayer.slice(0, 20), text: prayer, context })
    setSaved(true)
  }

  return (
    <div className="prayer-card animate-fade-up">
      <div className="prayer-header">
        <span className="prayer-label">A Prayer for You</span>
      </div>
      <p className="prayer-text">{prayer}</p>
      <div className="prayer-actions">
        <button className="paction-btn ripple" onClick={copy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button className={`paction-btn ripple ${saved ? 'saved' : ''}`} onClick={save}>
          {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          {saved ? 'Saved' : 'Save prayer'}
        </button>
      </div>
    </div>
  )
}
