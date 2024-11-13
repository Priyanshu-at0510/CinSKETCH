import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '../app/globals.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)