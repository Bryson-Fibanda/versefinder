import React, { useState, useEffect } from 'react'
import { Bookmark, BookOpen, Trash2, Heart } from 'lucide-react'
import { getSaved, deleteItem } from '../utils/storage.js'
import PageHeader from '../components/PageHeader.jsx'
import './SavedPage.css'

export default function SavedPage() {
  const [items, setItems] = useState([])
  const [tab, setTab] = useState('all')

  useEffect(() => { setItems(getSaved()) }, [])

  function remove(id) {
    deleteItem(id)
    setItems(i => i.filter(x => x.id !== id))
  }

  const filtered = tab === 'all' ? items
    : tab === 'verses' ? items.filter(i => i.type === 'verse')
    : items.filter(i => i.type === 'prayer')

  return (
    <div className="saved-page">
      <PageHeader title="Saved" subtitle="Your verses and prayers" icon={Bookmark} />

      <div className="saved-container">
        {/* Filter tabs */}
        <div className="saved-tabs">
          {[['all', 'All'], ['verses', 'Verses'], ['prayers', 'Prayers']].map(([id, label]) => (
            <button key={id} className={`stab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              {label}
              <span className="stab-count">
                {id === 'all' ? items.length
                  : id === 'verses' ? items.filter(i => i.type === 'verse').length
                  : items.filter(i => i.type === 'prayer').length}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="saved-empty animate-fade-in">
            <div className="empty-icon">
              {tab === 'prayers' ? <Heart size={32} strokeWidth={1} /> : <BookOpen size={32} strokeWidth={1} />}
            </div>
            <p className="empty-title">Nothing saved yet</p>
            <p className="empty-sub">Save verses and prayers from your guidance sessions and they will appear here.</p>
          </div>
        ) : (
          <div className="saved-list">
            {filtered.map((item, i) => (
              <div key={item.id} className={`saved-item animate-fade-up delay-${Math.min(i+1,5)}`}>
                <div className="saved-item-top">
                  <span className={`saved-type-badge ${item.type}`}>
                    {item.type === 'verse' ? <BookOpen size={11} /> : <Heart size={11} />}
                    {item.type}
                  </span>
                  <span className="saved-date">{new Date(item.savedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}</span>
                </div>

                {item.type === 'verse' ? (
                  <>
                    <p className="saved-ref">{item.reference}</p>
                    {item.text && <p className="saved-verse-text">"{item.text}"</p>}
                    {item.explanation && <p className="saved-explanation">{item.explanation}</p>}
                  </>
                ) : (
                  <p className="saved-prayer-text">{item.text}</p>
                )}

                <button className="saved-delete ripple" onClick={() => remove(item.id)} aria-label="Delete">
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
