import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Plus, Minus, Save, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getDailyActivity, upsertDailyActivity, updateUserProfile } from '../lib/supabase'
import { format } from 'date-fns'
import ProgressBar from '../components/ProgressBar'

const QuranTracker = () => {
  const { user, profile, refreshProfile } = useAuth()
  const [pages, setPages] = useState(0)
  const [todayPages, setTodayPages] = useState(0)
  const [todayPoints, setTodayPoints] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return
      const today = format(new Date(), 'yyyy-MM-dd')
      const activity = await getDailyActivity(user.id, today)
      if (activity) {
        setTodayPages(activity.quran_pages || 0)
        setTodayPoints(activity.points || 0)
      }
    }
    fetchActivity()
  }, [user])

  const handleIncrement = () => setPages(prev => prev + 1)
  const handleDecrement = () => setPages(prev => Math.max(0, prev - 1))

  const handleSave = async () => {
    if (pages === 0) return
    
    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const pointsEarned = pages * 5
      
      const activity = {
        user_id: user.id,
        date: today,
        quran_pages: todayPages + pages,
        points: todayPoints + pointsEarned
      }

      await upsertDailyActivity(activity)
      
      // Update user profile
      await updateUserProfile(user.id, {
        total_points: (profile?.total_points || 0) + pointsEarned
      })

      setTodayPages(prev => prev + pages)
      setTodayPoints(prev => prev + pointsEarned)
      setPages(0)
      refreshProfile()
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Error saving Quran progress:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold text-primary-green mb-2">Quran Reading</h1>
        <p className="text-gray-600">Track your daily Quran recitation</p>
      </motion.div>

      {/* Today's Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="text-soft-gold" size={24} />
            <span className="font-semibold text-gray-800">Today's Reading</span>
          </div>
          <span className="text-2xl font-bold text-primary-green">{todayPages} pages</span>
        </div>
        <ProgressBar progress={todayPages} max={20} color="bg-soft-gold" />
        <p className="text-center text-sm text-gray-500 mt-2">
          {todayPages >= 20 ? 'Excellent progress today!' : `${20 - todayPages} pages to reach daily goal`}
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="font-bold text-lg text-gray-800 mb-6 text-center">Log Pages Read</h2>
        
        <div className="flex items-center justify-center gap-6 mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDecrement}
            disabled={pages === 0}
            className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={24} />
          </motion.button>
          
          <motion.div
            key={pages}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-2xl bg-primary-green/10 border-2 border-primary-green/20 flex items-center justify-center"
          >
            <span className="text-4xl font-bold text-primary-green">{pages}</span>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleIncrement}
            className="w-14 h-14 rounded-full bg-primary-green flex items-center justify-center text-white hover:bg-primary-green/90 transition-colors shadow-lg shadow-primary-green/30"
          >
            <Plus size={24} />
          </motion.button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 mb-1">Points to earn</p>
          <p className="text-2xl font-bold text-soft-gold">+{pages * 5} points</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={pages === 0 || loading}
          className="w-full py-3 bg-primary-green text-white rounded-xl font-semibold shadow-lg shadow-primary-green/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Save size={20} />
              Save Progress
            </>
          )}
        </motion.button>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-3 bg-green-50 text-green-600 rounded-xl text-center flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            Progress saved successfully!
          </motion.div>
        )}
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-soft-gold/10 rounded-2xl border border-soft-gold/20 text-center"
      >
        <p className="text-sm text-gray-600 italic font-arabic">
          "The best of you are those who learn the Quran and teach it."
        </p>
        <p className="text-xs text-gray-500 mt-1">— Prophet Muhammad ﷺ</p>
      </motion.div>
    </div>
  )
}

export default QuranTracker