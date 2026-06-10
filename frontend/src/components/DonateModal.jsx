import React, { useEffect } from 'react'
import { X, Heart, Smartphone } from 'lucide-react'
import './DonateModal.css'

const MPESA_TILL = import.meta.env.VITE_MPESA_TILL || '000000'
const MPESA_NAME = import.meta.env.VITE_MPESA_NAME || 'VerseFinder'

export default function DonateModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label="Support VerseFinder">
      <div className="modal-sheet animate-fade-up">
        <div className="modal-handle" />

        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="modal-icon">
          <Heart size={22} strokeWidth={1.5} />
        </div>

        <h2 className="modal-title">Support This Ministry</h2>
        <p className="modal-subtitle">
          VerseFinder is completely free and will always be. If the Word has blessed you, 
          consider sowing a seed to keep this service running for others.
        </p>

        <div className="mpesa-card">
          <div className="mpesa-row">
            <Smartphone size={18} strokeWidth={1.5} />
            <span className="mpesa-label">M-Pesa Till Number</span>
          </div>
          <div className="mpesa-number">{MPESA_TILL}</div>
          <p className="mpesa-name">{MPESA_NAME}</p>
          <div className="mpesa-steps">
            <p className="mpesa-steps-title">How to send:</p>
            <ol>
              <li>Open M-Pesa on your phone</li>
              <li>Select <strong>Lipa na M-Pesa</strong></li>
              <li>Select <strong>Buy Goods & Services</strong></li>
              <li>Enter Till: <strong>{MPESA_TILL}</strong></li>
              <li>Enter any amount you feel led to give</li>
            </ol>
          </div>
        </div>

        <p className="modal-verse">
          "Each of you should give what you have decided in your heart to give, 
          not reluctantly or under compulsion, for God loves a cheerful giver."
        </p>
        <p className="modal-verse-ref">— 2 Corinthians 9:7</p>

        <button className="modal-done" onClick={onClose}>
          God bless you
        </button>
      </div>
    </div>
  )
}
