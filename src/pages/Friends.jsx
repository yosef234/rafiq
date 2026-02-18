import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Copy, Check, Trophy, Flame, Star, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getLeaderboard, addFriend } from '../lib/supabase'

const Friends = () => {
  const { profile, user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [friendCode, setFriendCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user) return
      const data = await getLeaderboard(user.id)
      setLeaderboard(data)
    }
    fetchLeaderboard()
  }, [user])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile?.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddFriend = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await addFriend(user.id, friendCode.toUpperCase())
      setFriendCode('')
      setShowAddModal(false)
      // Refresh leaderboard
      const data = await getLeaderboard(user.id)
      setLeaderboard(data)
    } catch (err) {
      setError(err.message || 'Failed to add friend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-primary-green">Friends</h1>
          <p className="text-gray-600">Compete and motivate each other</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 rounded-full bg-primary-green text-white flex items-center justify-center shadow-lg"
        >
          <Plus size={24} />
        </motion.button>
      </motion.div>

      {/* Invite Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary-green to-dark-green rounded-2xl p-5 text-white mb-6 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <Users size={20} className="text-soft-gold" />
          <span className="font-semibold">Your Invite Code</span>
        </div>
        <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 backdrop-blur-sm">
          <span className="text-2xl font-mono font-bold tracking-wider">
            {profile?.invite_code}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyCode}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            {copied ? <Check size={20} className="text-green-300" /> : <Copy size={20} />}
          </motion.button>
        </div>
        <p className="text-sm text-white/70 mt-3">
          Share this code with friends to connect
        </p>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Trophy className="text-soft-gold" size={24} />
          <h2 className="font-bold text-lg text-gray-800">Leaderboard</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {leaderboard.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={`
                p-4 flex items-center justify-between
                ${friend.id === user?.id ? 'bg-soft-gold/5' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                    index === 1 ? 'bg-gray-300 text-gray-700' : 
                    index === 2 ? 'bg-orange-300 text-orange-800' : 'bg-gray-100 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {friend.username}
                    {friend.id === user?.id && <span className="text-xs text-soft-gold ml-2">(You)</span>}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Flame size={12} className="text-orange-500" />
                      {friend.streak}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-soft-gold" />
                      Lvl {friend.level}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-green text-lg">{friend.total_points}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Add Friend</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleAddFriend}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Friend's Code
                  </label>
                  <input
                    type="text"
                    value={friendCode}
                    onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-soft-gold focus:ring-2 focus:ring-soft-gold/20 outline-none uppercase text-center tracking-widest font-mono text-lg"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mb-4 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || friendCode.length !== 6}
                  className="w-full py-3 bg-primary-green text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Friend'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Friends