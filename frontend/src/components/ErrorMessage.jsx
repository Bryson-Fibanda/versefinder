import React from 'react'
import { AlertCircle } from 'lucide-react'
import './ErrorMessage.css'

export default function ErrorMessage({ message }) {
  return (
    <div className="error-box animate-fade-in" role="alert">
      <AlertCircle size={16} strokeWidth={1.5} />
      <p>{message}</p>
    </div>
  )
}
