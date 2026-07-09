import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { TasksProvider } from './contexts/TasksContext'
import ReactErrorBoundary from './components/error/ReactErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <ReactErrorBoundary>
    <TasksProvider>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    </TasksProvider>
  </ReactErrorBoundary>
)