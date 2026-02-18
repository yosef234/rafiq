import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PrayerLog from './pages/PrayerLog'
import QuranTracker from './pages/QuranTracker'
import Tasbeeh from './pages/Tasbeeh'
import Friends from './pages/Friends'
import Profile from './pages/Profile'

// Components
import BottomNav from './components/BottomNav'
import LoadingScreen from './components/LoadingScreen'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingScreen />
  return user ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingScreen />
  return !user ? children : <Navigate to="/" />
}

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-cream islamic-pattern">
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/prayers" 
            element={
              <PrivateRoute>
                <PrayerLog />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/quran" 
            element={
              <PrivateRoute>
                <QuranTracker />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/tasbeeh" 
            element={
              <PrivateRoute>
                <Tasbeeh />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/friends" 
            element={
              <PrivateRoute>
                <Friends />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
        </Routes>
      </AnimatePresence>
      
      {user && <BottomNav />}
    </div>
  )
}

export default App