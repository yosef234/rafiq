import React from 'react'
import { motion } from 'framer-motion'

const ProgressBar = ({ progress, max = 100, color = 'bg-soft-gold', height = 'h-3', showLabel = true }) => {
  const percentage = Math.min((progress / max) * 100, 100)
  
  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-gray-200 rounded-full overflow-hidden relative`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full relative`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </motion.div>
      </div>
      {showLabel && (
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{progress} / {max}</span>
          <span className="font-semibold text-primary-green">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar