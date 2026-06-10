import React, { useState } from 'react'
import BottomNav from './components/BottomNav.jsx'
import HomePage from './pages/HomePage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import ExplorePage from './pages/ExplorePage.jsx'
import GivePage from './pages/GivePage.jsx'
import './App.css'

const PAGES = ['home', 'saved', 'explore', 'give']

export default function App() {
  const [page, setPage] = useState('home')
  const [prevPage, setPrevPage] = useState(null)

  function navigate(p) {
    setPrevPage(page)
    setPage(p)
  }

  return (
    <div className="app">
      <div className="page-wrap">
        {page === 'home'    && <HomePage    key="home"    onNavigate={navigate} />}
        {page === 'saved'   && <SavedPage   key="saved"   />}
        {page === 'explore' && <ExplorePage key="explore" />}
        {page === 'give'    && <GivePage    key="give"    />}
      </div>
      <BottomNav current={page} onChange={navigate} />
    </div>
  )
}
