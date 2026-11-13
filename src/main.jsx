import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './clean-routing'
import './press-feedback'
import './runtime-audit'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
