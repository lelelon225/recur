import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { TasksProvider } from './contexts/TasksContext'
import ReactErrorBoundary from './components/error/ReactErrorBoundary.tsx'
import { TooltipProvider } from './components/ui/tooltip'
import { SidebarProvider } from './components/ui/sidebar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactErrorBoundary>
      <TasksProvider>
        <TooltipProvider>
          <SidebarProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </TasksProvider>
    </ReactErrorBoundary>
  </StrictMode>
)