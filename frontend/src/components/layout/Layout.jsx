import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout({ children, currentMode, onModeChange, onQuestionClick, onClear }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Desktop sidebar */}
      <div className="sidebar-desktop" style={{ display: 'flex' }}>
        <Sidebar
          currentMode={currentMode}
          onModeChange={onModeChange}
          onQuestionClick={onQuestionClick}
          onClear={onClear}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
            }}
          />
          {/* Sidebar */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
            }}
          >
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

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* TopBar — always visible */}
        <TopBar
          currentMode={currentMode}
          onMenuToggle={() => setMobileMenuOpen((v) => !v)}
        />
        {children}
      </div>
    </div>
  )
}
