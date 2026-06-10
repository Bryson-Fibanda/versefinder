import React from 'react'
import { BookOpen, RotateCcw } from 'lucide-react'
import SeekForm from '../components/SeekForm.jsx'
import EmpathyCard from '../components/EmpathyCard.jsx'
import VerseCarousel from '../components/VerseCarousel.jsx'
import AdviceCard from '../components/AdviceCard.jsx'
import PrayerCard from '../components/PrayerCard.jsx'
import LoadingState from '../components/LoadingState.jsx'
import { useSeek } from '../hooks/useSeek.js'
import './HomePage.css'

export default function HomePage() {
  const { loading, result, error, seek, reset } = useSeek()

  return (
    <div className="home-page">
      {/* Top bar */}
      <div className="home-topbar">
        <div className="home-brand">
          <div className="home-brand-icon">
            <BookOpen size={17} strokeWidth={1.5} />
          </div>
          <span className="home-brand-name">VerseFinder</span>
        </div>
        {result && (
          <button className="home-reset ripple" onClick={reset}>
            <RotateCcw size={15} />
            New
          </button>
        )}
      </div>

      <div className="home-container">
        {/* Hero - only when no result */}
        {!result && !loading && (
          <div className="home-hero animate-fade-up">
            <h1 className="home-title">
              The Word<br />
              <em>for your moment</em>
            </h1>
            <p className="home-sub">
              Share what you are carrying. Receive scripture, guidance, and a prayer — in your language.
            </p>
          </div>
        )}

        {/* Form - only when no result */}
        {!result && (
          <SeekForm onSubmit={seek} loading={loading} />
        )}

        {/* Loading */}
        {loading && <LoadingState />}

        {/* Error */}
        {error && !loading && (
          <div className="home-error animate-fade-in">
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="home-result">
            <EmpathyCard text={result.empathy} />
            {result.verses?.length > 0 && (
              <section className="result-section">
                <p className="section-label">The Word for You</p>
                <VerseCarousel verses={result.verses} />
              </section>
            )}
            {result.advice?.length > 0 && (
              <section className="result-section">
                <AdviceCard steps={result.advice} />
              </section>
            )}
            {result.prayer && (
              <section className="result-section">
                <PrayerCard prayer={result.prayer} context={result.empathy} />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
