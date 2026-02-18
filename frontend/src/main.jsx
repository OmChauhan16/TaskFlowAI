import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import TaskProvider from './context/TaskContext.jsx'
import AIProvider from './context/AIContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TaskProvider>
        <AIProvider>
          <App />
        </AIProvider>
      </TaskProvider>
    </AuthProvider>
  </StrictMode>
)
