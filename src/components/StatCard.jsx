import React from 'react'
import { motion } from 'framer-motion'

const StatCard = ({ icon: Icon, label, value, subtext, color = 'soft-gold', delay = 0 }) => {
  const colorClasses = {
    'soft-gold': 'bg-soft-gold/10 text-soft-gold border-soft-gold/20',
    'primary-green': 'bg-primary-green/10 text-primary-green border-primary-green/20',
    'light-gold': 'bg-light-gold/50 text-dark-green border-light-gold',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`p-4 rounded-2xl border ${colorClasses[color]} backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-80 mb-1">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {subtext && <p className="text-xs mt-1 opacity-70">{subtext}</p>}
        </div>
        <div className={`p-2 rounded-xl bg-white/50`}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard