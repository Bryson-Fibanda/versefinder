import React, { useState, useRef, useEffect } from 'react'
import { Send, X } from 'lucide-react'
import './SeekForm.css'

const PLACEHOLDERS = [
  "I am struggling with anxiety and cannot sleep...",
  "Niko stressed sana na pesa, sijui nifanye nini...",
  "I feel lost and have no direction in life...",
  "My relationship is falling apart...",
  "Nahisi peke yangu, hakuna anayenielewa...",
  "I need strength to forgive someone who hurt me...",
]

export default function SeekForm({ onSubmit, loading }) {
  const [text, setText] = useState('')
  const [phIdx, setPhIdx] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setPhIdx(i => (i + 1) % PLACEHOLDERS.length), 4000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, 180)}px`
    }
  }, [text])

  function handleSubmit() {
    if (text.trim().length < 5 || loading) return
    onSubmit(text.trim())
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
  }

  const ready = text.trim().length >= 5 && !loading

  return (
    <div className="seek-form-wrap animate-fade-up">
      <p className="seek-label">What is on your heart?</p>
      <div className="seek-box">
        <textarea
          ref={ref}
          className="seek-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder={PLACEHOLDERS[phIdx]}
          disabled={loading}
          maxLength={500}
          rows={3}
        />
        <div className="seek-actions">
          <span className="char-count">{text.length}/500</span>
          <div className="seek-btns">
            {text.length > 0 && (
              <button className="icon-btn ripple" onClick={() => { setText(''); ref.current?.focus() }} type="button">
                <X size={15} />
              </button>
            )}
            <button className={`submit-btn ripple ${ready ? 'active' : ''}`} onClick={handleSubmit} disabled={!ready} type="button">
              {loading ? <span className="btn-spinner" /> : <><Send size={14} strokeWidth={2.5} /><span>Seek</span></>}
            </button>
          </div>
        </div>
      </div>
      <p className="seek-hint">Write in English, Swahili, Sheng — however feels natural</p>
    </div>
  )
}
