import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import TaskProvider from './context/TaskContext.jsx'
import AIProvider from './context/AIContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TaskProvider>
        <AIProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </AIProvider>
      </TaskProvider>
    </AuthProvider>
  </StrictMode>
)
