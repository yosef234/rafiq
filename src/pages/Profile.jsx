import React from 'react'
import { motion } from 'framer-motion'
import { LogOut, Bell, Moon, Shield, ChevronRight, Award } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

const Profile = () => {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const menuItems = [
    { icon: Bell, label: 'Notifications', value: 'On' },
    { icon: Moon, label: 'Dark Mode', value: 'Off' },
    { icon: Shield, label: 'Privacy', value: '' },
    { icon: Award, label: 'Achievements', value: '12' },
  ]

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-green to-dark-green flex items-center justify-center shadow-xl">
          <span className="text-3xl font-bold text-white">
            {profile?.username?.charAt(0).toUpperCase()}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{profile?.username}</h1>
        <p className="text-gray-500">{profile?.email}</p>
        
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-xl font-bold text-primary-green">Lvl {profile?.level}</p>
            <p className="text-xs text-gray-500">Level</p>
          </div>
          <div className="text-center px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-xl font-bold text-soft-gold">{profile?.total_points}</p>
            <p className="text-xs text-gray-500">Points</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6"
      >
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green">
                <item.icon size={20} />
              </div>
              <span className="font-medium text-gray-800">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.value && <span className="text-sm text-gray-500">{item.value}</span>}
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="w-full p-4 bg-red-50 text-red-600 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut size={20} />
        Sign Out
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8"
      >
        <Logo size="sm" showText={false} animate={false} />
        <p className="text-xs text-gray-400 mt-2">Rafiq v1.0.0</p>
      </motion.div>
    </div>
  )
}

export default Profile