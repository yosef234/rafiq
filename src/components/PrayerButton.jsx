import React from 'react'
import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'

const PrayerButton = ({ name, arabicName, completed, onClick, time, delay = 0 }) => {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={completed}
      className={`
        w-full p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between
        ${completed 
          ? 'bg-primary-green/10 border-primary-green/30' 
          : 'bg-white border-gray-200 hover:border-soft-gold/50 hover:shadow-lg'
        }
      `}
    >
      <div className="flex items-center gap-4">
        <motion.div 
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${completed ? 'bg-primary-green text-white' : 'bg-gray-100 text-gray-400'}
          `}
          whileHover={!completed ? { rotate: 180 } : {}}
          transition={{ duration: 0.3 }}
        >
          {completed ? <Check size={24} /> : <Circle size={24} />}
        </motion.div>
        <div className="text-left">
          <h3 className={`font-semibold ${completed ? 'text-primary-green' : 'text-gray-800'}`}>
            {name}
          </h3>
          <p className="text-sm text-gray-500 font-arabic">{arabicName}</p>
          {time && <p className="text-xs text-soft-gold mt-1">{time}</p>}
        </div>
      </div>
      
      {!completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 py-1 bg-soft-gold/10 text-soft-gold text-xs rounded-full font-medium"
        >
          +10 pts
        </motion.div>
      )}
      
      {completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-primary-green"
        >
          <Check size={20} />
        </motion.div>
      )}
    </motion.button>
  )
}

export default PrayerButton