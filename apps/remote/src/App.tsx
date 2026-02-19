import { useState, useRef, useEffect } from 'react'

const STORYBOOK_URL = import.meta.env.VITE_STORYBOOK_URL || 'http://localhost:6006'

type LoadState = 'loading' | 'ready' | 'error'

export default function App() {
  const [state, setState] = useState<LoadState>('loading')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    // Timeout after 15s
    timerRef.current = setTimeout(() => {
      if (state === 'loading') setState('error')
    }, 15000)

    return () => clearTimeout(timerRef.current)
  }, [state])

  const handleLoad = () => {
    clearTimeout(timerRef.current)
    setState('ready')
  }

  const handleError = () => {
    clearTimeout(timerRef.current)
    setState('error')
  }

  const handleRetry = () => {
    setState('loading')
    if (iframeRef.current) {
      iframeRef.current.src = STORYBOOK_URL
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: '600px' }}>
      {state === 'loading' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            color: '#888',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid rgba(136,136,136,0.2)',
              borderTopColor: '#888',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ margin: 0, fontSize: '14px' }}>Storybook 로딩 중...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {state === 'error' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            color: '#888',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: '48px', height: '48px', color: '#ef4444' }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Storybook에 연결할 수 없습니다.
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
            Storybook이 {STORYBOOK_URL} 에서 실행 중인지 확인해주세요.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            style={{
              padding: '8px 20px',
              border: '1px solid #555',
              borderRadius: '6px',
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            다시 시도
          </button>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={STORYBOOK_URL}
        onLoad={handleLoad}
        onError={handleError}
        title="Storybook"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: state === 'ready' ? 'block' : 'none',
          minHeight: '600px',
        }}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
