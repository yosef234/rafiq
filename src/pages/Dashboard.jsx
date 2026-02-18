import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Trophy, Star, Target, TrendingUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getDailyActivity, getLeaderboard, supabase } from '../lib/supabase'
import { format } from 'date-fns'
import Logo from '../components/Logo'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'

const Dashboard = () => {
  const { profile, user, refreshProfile } = useAuth()
  const [todayActivity, setTodayActivity] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      
      try {
        const today = format(new Date(), 'yyyy-MM-dd')
        const [activity, friends] = await Promise.all([
          getDailyActivity(user.id, today),
          getLeaderboard(user.id)
        ])
        
        setTodayActivity(activity || {
          prayer_count: 0,
          quran_pages: 0,
          tasbeeh_count: 0,
          points: 0
        })
        setLeaderboard(friends.slice(0, 3))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Subscribe to realtime changes
    const subscription = supabase
      .channel('dashboard_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'daily_activity',
        filter: `user_id=eq.${user?.id}`
      }, () => {
        fetchData()
        refreshProfile()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const calculateDailyProgress = () => {
    if (!todayActivity) return 0
    const prayerPoints = todayActivity.prayer_count * 10
    const quranPoints = todayActivity.quran_pages * 5
    const tasbeehPoints = Math.floor(todayActivity.tasbeeh_count / 100) * 10
    const total = prayerPoints + quranPoints + tasbeehPoints
    return Math.min(total, 300)
  }

  const dailyProgress = calculateDailyProgress()
  const userRank = leaderboard.findIndex(p => p.id === user?.id) + 1 || '-'

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
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-primary-green">
            Assalamu Alaikum,
          </h1>
          <p className="text-gray-600">{profile?.username || 'Friend'}</p>
        </div>
        <Logo size="sm" showText={false} animate={false} />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Trophy}
          label="Total Points"
          value={profile?.total_points || 0}
          color="soft-gold"
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={`${profile?.streak || 0} days`}
          subtext="Keep it up!"
          color="primary-green"
          delay={0.2}
        />
        <StatCard
          icon={Star}
          label="Level"
          value={profile?.level || 1}
          subtext={`${1000 - ((profile?.total_points || 0) % 1000)} to next`}
          color="light-gold"
          delay={0.3}
        />
        <StatCard
          icon={TrendingUp}
          label="Rank"
          value={`#${userRank}`}
          subtext="Among friends"
          color="soft-gold"
          delay={0.4}
        />
      </div>

      {/* Daily Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="text-soft-gold" size={24} />
            <h2 className="font-bold text-lg text-gray-800">Daily Progress</h2>
          </div>
          <span className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMM d')}</span>
        </div>
        
        <ProgressBar progress={dailyProgress} max={300} />
        
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-green">{todayActivity?.prayer_count || 0}/5</p>
            <p className="text-xs text-gray-500">Prayers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-green">{todayActivity?.quran_pages || 0}</p>
            <p className="text-xs text-gray-500">Pages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-green">{todayActivity?.tasbeeh_count || 0}</p>
            <p className="text-xs text-gray-500">Tasbeeh</p>
          </div>
        </div>
      </motion.div>

      {/* Mini Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"
      >
        <h2 className="font-bold text-lg text-gray-800 mb-4">Friends Leaderboard</h2>
        <div className="space-y-3">
          {leaderboard.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-xl ${
                friend.id === user?.id ? 'bg-soft-gold/10 border border-soft-gold/20' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                    index === 1 ? 'bg-gray-300 text-gray-700' : 
                    index === 2 ? 'bg-orange-300 text-orange-800' : 'bg-gray-200 text-gray-600'}
                `}>
                  {index + 1}
                </span>
                <span className="font-medium text-gray-800">{friend.username}</span>
              </div>
              <span className="font-bold text-primary-green">{friend.total_points} pts</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard