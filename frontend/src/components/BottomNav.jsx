import React from 'react'
import { Home, Bookmark, Compass, Heart } from 'lucide-react'
import './BottomNav.css'

const TABS = [
  { id: 'home',    label: 'Home',    Icon: Home },
  { id: 'saved',   label: 'Saved',   Icon: Bookmark },
  { id: 'explore', label: 'Explore', Icon: Compass },
  { id: 'give',    label: 'Give',    Icon: Heart },
]

export default function BottomNav({ current, onChange }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-tab ripple ${current === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
          aria-label={label}
          aria-current={current === id ? 'page' : undefined}
        >
          <span className="nav-icon-wrap">
            <Icon size={22} strokeWidth={current === id ? 2 : 1.5} />
            {current === id && <span className="nav-dot" />}
          </span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
