import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

if (typeof (globalThis as Record<string, unknown>).Buffer === 'undefined') {
  ;(globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
