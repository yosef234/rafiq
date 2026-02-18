import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Sun, Sunrise, Sunset, Moon, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getDailyActivity, upsertDailyActivity, updateUserProfile, supabase } from '../lib/supabase'
import { format } from 'date-fns'
import PrayerButton from '../components/PrayerButton'
import ProgressBar from '../components/ProgressBar'

const prayers = [
  { id: 'fajr', name: 'Fajr', arabicName: 'الفجر', icon: Sunrise, time: 'Dawn' },
  { id: 'dhuhr', name: 'Dhuhr', arabicName: 'الظهر', icon: Sun, time: 'Noon' },
  { id: 'asr', name: 'Asr', arabicName: 'العصر', icon: Sun, time: 'Afternoon' },
  { id: 'maghrib', name: 'Maghrib', arabicName: 'المغرب', icon: Sunset, time: 'Sunset' },
  { id: 'isha', name: 'Isha', arabicName: 'العشاء', icon: Moon, time: 'Night' },
]

const PrayerLog = () => {
  const { user, profile, refreshProfile } = useAuth()
  const [completedPrayers, setCompletedPrayers] = useState([])
  const [todayPoints, setTodayPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const fetchTodayActivity = async () => {
      if (!user) return
      const today = format(new Date(), 'yyyy-MM-dd')
      const activity = await getDailyActivity(user.id, today)
      
      if (activity) {
        const prayers = []
        if (activity.fajr) prayers.push('fajr')
        if (activity.dhuhr) prayers.push('dhuhr')
        if (activity.asr) prayers.push('asr')
        if (activity.maghrib) prayers.push('maghrib')
        if (activity.isha) prayers.push('isha')
        setCompletedPrayers(prayers)
        setTodayPoints(activity.points || 0)
      }
      setLoading(false)
    }

    fetchTodayActivity()
  }, [user])

  const handlePrayerComplete = async (prayerId) => {
    if (completedPrayers.includes(prayerId)) return

    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const newCompletedPrayers = [...completedPrayers, prayerId]
      
      const activity = {
        user_id: user.id,
        date: today,
        prayer_count: newCompletedPrayers.length,
        points: todayPoints + 10,
        [prayerId]: true
      }

      await upsertDailyActivity(activity)
      
      // Update user total points
      await updateUserProfile(user.id, {
        total_points: (profile?.total_points || 0) + 10
      })

      setCompletedPrayers(newCompletedPrayers)
      setTodayPoints(prev => prev + 10)
      refreshProfile()

      // Check if all prayers completed
      if (newCompletedPrayers.length === 5) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 3000)
        
        // Add completion bonus
        await updateUserProfile(user.id, {
          total_points: (profile?.total_points || 0) + 20
        })
      }
    } catch (error) {
      console.error('Error logging prayer:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-soft-gold border-t-primary-green rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto relative">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-primary-green/90 backdrop-blur-lg rounded-3xl p-8 text-center text-white shadow-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={48} className="mx-auto mb-4 text-soft-gold" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">MashaAllah!</h2>
              <p className="text-lg">All prayers completed!</p>
              <p className="text-soft-gold font-bold mt-2">+20 bonus points</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold text-primary-green mb-2">Daily Prayers</h1>
        <p className="text-gray-600">Track your Salah and earn rewards</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">Today's Progress</span>
          <span className="font-bold text-primary-green">{completedPrayers.length}/5</span>
        </div>
        <ProgressBar progress={completedPrayers.length} max={5} color="bg-primary-green" />
        <p className="text-center text-sm text-gray-500 mt-3">
          {completedPrayers.length === 5 
            ? 'All prayers completed! 🎉' 
            : `${5 - completedPrayers.length} prayers remaining`}
        </p>
      </motion.div>

      <div className="space-y-3">
        {prayers.map((prayer, index) => (
          <PrayerButton
            key={prayer.id}
            name={prayer.name}
            arabicName={prayer.arabicName}
            time={prayer.time}
            completed={completedPrayers.includes(prayer.id)}
            onClick={() => handlePrayerComplete(prayer.id)}
            delay={0.2 + index * 0.1}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 p-4 bg-soft-gold/10 rounded-2xl border border-soft-gold/20"
      >
        <div className="flex items-center gap-2 text-soft-gold mb-2">
          <CheckCircle size={20} />
          <span className="font-semibold">Daily Reward</span>
        </div>
        <p className="text-sm text-gray-600">
          Complete all 5 prayers today to earn a <span className="font-bold text-primary-green">+20 point bonus</span> and maintain your streak!
        </p>
      </motion.div>
    </div>
  )
}

export default PrayerLog