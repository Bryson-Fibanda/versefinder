import React from 'react'
import { BookOpen } from 'lucide-react'
import './Header.css'

export default function Header({ onDonate }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-icon-wrap">
            <BookOpen size={18} strokeWidth={1.5} />
          </div>
          <span className="header-title">VerseFinder</span>
        </div>
        <button className="donate-btn" onClick={onDonate} aria-label="Support this ministry">
          Support
        </button>
      </div>
    </header>
  )
}
