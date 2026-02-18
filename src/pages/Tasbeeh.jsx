import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Save, Sparkles, Target } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getDailyActivity, upsertDailyActivity, updateUserProfile } from '../lib/supabase'
import { format } from 'date-fns'
import ProgressBar from '../components/ProgressBar'

const dhikrList = [
  { id: 'subhanallah', text: 'SubhanAllah', arabic: 'سُبْحَانَ ٱللَّٰهِ', target: 33 },
  { id: 'alhamdulillah', text: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', target: 33 },
  { id: 'allahuakbar', text: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', target: 33 },
  { id: 'lailaha', text: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', target: 100 },
]

const Tasbeeh = () => {
  const { user, profile, refreshProfile } = useAuth()
  const [selectedDhikr, setSelectedDhikr] = useState(dhikrList[0])
  const [count, setCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [todayCount, setTodayCount] = useState(0)
  const [todayPoints, setTodayPoints] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return
      const today = format(new Date(), 'yyyy-MM-dd')
      const activity = await getDailyActivity(user.id, today)
      if (activity) {
        setTodayCount(activity.tasbeeh_count || 0)
        setTodayPoints(activity.points || 0)
      }
    }
    fetchActivity()
  }, [user])

  const handleIncrement = () => {
    setCount(prev => prev + 1)
    setTotalCount(prev => prev + 1)
  }

  const handleReset = () => {
    setCount(0)
  }

  const handleSave = async () => {
    if (count === 0) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const newTotalCount = todayCount + count
      const pointsFromTasbeeh = Math.floor(newTotalCount / 100) * 10 - Math.floor(todayCount / 100) * 10
      
      const activity = {
        user_id: user.id,
        date: today,
        tasbeeh_count: newTotalCount,
        points: todayPoints + pointsFromTasbeeh
      }

      await upsertDailyActivity(activity)
      
      if (pointsFromTasbeeh > 0) {
        await updateUserProfile(user.id, {
          total_points: (profile?.total_points || 0) + pointsFromTasbeeh
        })
      }

      setTodayCount(newTotalCount)
      setTodayPoints(prev => prev + pointsFromTasbeeh)
      setCount(0)
      refreshProfile()
    } catch (error) {
      console.error('Error saving tasbeeh:', error)
    } finally {
      setLoading(false)
    }
  }

  const progress = (count / selectedDhikr.target) * 100

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold text-primary-green mb-2">Tasbeeh Counter</h1>
        <p className="text-gray-600">Digital dhikr companion</p>
      </motion.div>

      {/* Dhikr Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide"
      >
        {dhikrList.map((dhikr) => (
          <button
            key={dhikr.id}
            onClick={() => {
              setSelectedDhikr(dhikr)
              setCount(0)
            }}
            className={`
              px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all
              ${selectedDhikr.id === dhikr.id 
                ? 'bg-primary-green text-white shadow-lg' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-soft-gold'}
            `}
          >
            {dhikr.text}
          </button>
        ))}
      </motion.div>

      {/* Main Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-6 text-center"
      >
        <motion.div
          key={selectedDhikr.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-arabic text-primary-green mb-2">{selectedDhikr.arabic}</h2>
          <p className="text-gray-500">{selectedDhikr.text}</p>
        </motion.div>

        <div className="relative mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleIncrement}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-primary-green to-dark-green flex items-center justify-center shadow-2xl shadow-primary-green/40 mx-auto relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-soft-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <motion.span
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold text-white"
            >
              {count}
            </motion.span>
          </motion.button>
          
          {/* Ripple Effect */}
          <AnimatePresence>
            {count > 0 && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-48 h-48 rounded-full border-4 border-soft-gold/30 mx-auto pointer-events-none"
                style={{ top: 0, left: 0, right: 0, margin: '0 auto' }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{count} / {selectedDhikr.target}</span>
          </div>
          <ProgressBar progress={count} max={selectedDhikr.target} height="h-2" showLabel={false} />
        </div>

        <div className="flex gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            disabled={count === 0}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 flex items-center gap-2 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <RotateCcw size={18} />
            Reset
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={count === 0 || loading}
            className="px-6 py-2 rounded-xl bg-soft-gold text-white flex items-center gap-2 hover:bg-soft-gold/90 disabled:opacity-50 transition-colors shadow-lg shadow-soft-gold/30"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Save size={18} />
                Save
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <Target className="mx-auto mb-2 text-soft-gold" size={24} />
          <p className="text-2xl font-bold text-primary-green">{todayCount}</p>
          <p className="text-xs text-gray-500">Today's Count</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
          <Sparkles className="mx-auto mb-2 text-soft-gold" size={24} />
          <p className="text-2xl font-bold text-primary-green">+{Math.floor(todayCount / 100) * 10}</p>
          <p className="text-xs text-gray-500">Points Earned</p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-sm text-gray-500 mt-4"
      >
        Every 100 tasbeeh = 10 points
      </motion.p>
    </div>
  )
}

export default Tasbeeh