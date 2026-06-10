import React, { useState, useEffect } from 'react'
import { Compass, Search, BookOpen } from 'lucide-react'
import { fetchDevotional, searchTopic } from '../utils/api.js'
import { saveItem, isAlreadySaved } from '../utils/storage.js'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import LoadingState from '../components/LoadingState.jsx'
import './ExplorePage.css'

const TOPICS = ['Faith', 'Hope', 'Anxiety', 'Forgiveness', 'Healing', 'Purpose', 'Strength', 'Love', 'Grief', 'Gratitude']

function DevotionalCard({ data }) {
  const [saved, setSaved] = useState(false)
  function save() {
    if (saved) return
    saveItem({ type: 'prayer', reference: 'devo_' + data.title, text: data.prayer, context: data.reflection })
    setSaved(true)
  }
  return (
    <div className="devo-card animate-fade-up">
      <span className="devo-badge">Devotional of the Day</span>
      <h2 className="devo-title">{data.title}</h2>
      {data.verse_ref && (
        <div className="devo-verse-ref-row">
          <BookOpen size={14} strokeWidth={1.5} />
          <span>{data.verse_ref}</span>
        </div>
      )}
      {data.verse_text && (
        <blockquote className="devo-verse-text">"{data.verse_text}"</blockquote>
      )}
      <p className="devo-reflection">{data.reflection}</p>
      {data.application && (
        <div className="devo-application">
          <span className="devo-app-label">Today's Application</span>
          <p>{data.application}</p>
        </div>
      )}
      {data.prayer && (
        <div className="devo-prayer">
          <span className="devo-prayer-label">Prayer</span>
          <p className="devo-prayer-text">{data.prayer}</p>
          <button className={`devo-save-btn ripple ${saved ? 'saved' : ''}`} onClick={save}>
            {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {saved ? 'Prayer Saved' : 'Save Prayer'}
          </button>
        </div>
      )}
    </div>
  )
}

function SearchResults({ results, loading, error }) {
  if (loading) return <LoadingState />
  if (error) return <p className="explore-error">{error}</p>
  if (!results) return null
  return (
    <div className="search-results animate-fade-up">
      <p className="search-topic-title">{results.topic}</p>
      {results.summary && <p className="search-summary">{results.summary}</p>}
      <div className="search-verses">
        {results.verses?.map((v, i) => (
          <div key={i} className={`sv-card animate-fade-up delay-${i+1}`}>
            <p className="sv-ref">{v.reference}</p>
            {v.text && <p className="sv-text">"{v.text}"</p>}
            <p className="sv-explanation">{v.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ExplorePage() {
  const [devo, setDevo] = useState(null)
  const [devoLoading, setDevoLoading] = useState(true)
  const [devoError, setDevoError] = useState(null)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)

  useEffect(() => {
    fetchDevotional()
      .then(setDevo)
      .catch(e => setDevoError(e.message))
      .finally(() => setDevoLoading(false))
  }, [])

  async function doSearch(topic) {
    setSearchResults(null)
    setSearchError(null)
    setSearchLoading(true)
    try {
      const r = await searchTopic(topic)
      setSearchResults(r)
    } catch (e) {
      setSearchError(e.message)
    } finally {
      setSearchLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim().length < 2) return
    doSearch(query.trim())
  }

  return (
    <div className="explore-page">
      <PageHeader title="Explore" subtitle="Devotionals & Bible search" icon={Compass} />

      <div className="explore-container">
        {/* Search */}
        <div className="explore-search-wrap animate-fade-up">
          <form className="explore-search-box" onSubmit={handleSearch}>
            <Search size={17} strokeWidth={1.5} className="search-icon" />
            <input
              className="explore-search-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search a topic — faith, healing, purpose..."
              maxLength={80}
            />
            <button type="submit" className="explore-search-btn ripple" disabled={query.trim().length < 2}>
              Go
            </button>
          </form>
          <div className="topic-chips">
            {TOPICS.map(t => (
              <button key={t} className="topic-chip ripple" onClick={() => { setQuery(t); doSearch(t) }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Search results */}
        {(searchLoading || searchResults || searchError) && (
          <SearchResults results={searchResults} loading={searchLoading} error={searchError} />
        )}

        {/* Divider */}
        {!searchResults && !searchLoading && (
          <div className="explore-divider">
            <span>Today's Devotional</span>
          </div>
        )}

        {/* Devotional */}
        {!searchResults && !searchLoading && (
          devoLoading ? <LoadingState /> :
          devoError ? <p className="explore-error">{devoError}</p> :
          devo ? <DevotionalCard data={devo} /> : null
        )}
      </div>
    </div>
  )
}
