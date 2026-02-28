import { useContext, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import PrivateRoute from './components/auth/PrivateRoute'
import Dashboard from './components/Dashboard'
import Kanban from './components/Kanban'
import AuthCallback from './pages/AuthCallback'
import ProjectList from './components/projects/ProjectList'
import TaskList from './components/tasks/TaskList'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import QuickAddBar from './components/AI/QuickAddBar'
import ProfilePage from './components/Profile'
import SettingsPage from './components/Settings'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from './context/AuthContext'
function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#fff',
            color: '#363636',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '16px',
            fontSize: '14px',
          },

          // Success style
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },

          // Error style
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/kanban-board' element={<Kanban />} />
          <Route path='/auth/callback' element={<AuthCallback />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/dashboard'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path='/projects'
            element={
              <PrivateRoute>
                <ProjectList />
              </PrivateRoute>
            }
          />
          <Route path='/tasks'
            element={
              <PrivateRoute>
                <TaskList />
              </PrivateRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        {user && <QuickAddBar />}
      </BrowserRouter >
    </>
  )
}

export default App
