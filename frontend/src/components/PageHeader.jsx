import React from 'react'
import './PageHeader.css'

export default function PageHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="page-header">
      {Icon && (
        <div className="page-header-icon">
          <Icon size={20} strokeWidth={1.5} />
        </div>
      )}
      <div>
        <h1 className="page-header-title">{title}</h1>
        {subtitle && <p className="page-header-sub">{subtitle}</p>}
      </div>
    </div>
  )
}
