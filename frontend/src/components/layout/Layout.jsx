import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout({ children, currentMode, onModeChange, onQuestionClick, onClear }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="layout-root">
      <div className="sidebar-desktop">
        <Sidebar
          currentMode={currentMode}
          onModeChange={onModeChange}
          onQuestionClick={onQuestionClick}
          onClear={onClear}
        />
      </div>

      {mobileMenuOpen && (
        <div className="layout-mobile-overlay">
          <div
            className="layout-mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="layout-mobile-panel">
            <Sidebar
              currentMode={currentMode}
              onModeChange={(mode) => {
                onModeChange(mode)
                setMobileMenuOpen(false)
              }}
              onQuestionClick={(q) => {
                onQuestionClick(q)
                setMobileMenuOpen(false)
              }}
              onClear={() => {
                onClear()
                setMobileMenuOpen(false)
              }}
            />
          </div>
        </div>
      )}

      <div className="layout-main">
        <TopBar
          currentMode={currentMode}
          onMenuToggle={() => setMobileMenuOpen((v) => !v)}
        />
        {children}
      </div>
    </div>
  )
}
