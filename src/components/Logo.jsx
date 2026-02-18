import React from 'react'
import { motion } from 'framer-motion'

const Logo = ({ size = 'md', showText = true, animate = true }) => {
  const sizes = {
    sm: { container: 'w-10 h-10', text: 'text-xl' },
    md: { container: 'w-16 h-16', text: 'text-3xl' },
    lg: { container: 'w-24 h-24', text: 'text-5xl' },
    xl: { container: 'w-32 h-32', text: 'text-6xl' },
  }

  const { container, text } = sizes[size]

  const LogoContent = () => (
    <div className="flex flex-col items-center">
      <div className={`${container} relative`}>
        {/* Placeholder Logo - Replace with your actual logo image */}
        <div className="w-full h-full bg-gradient-to-br from-primary-green to-dark-green rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-soft-gold font-arabic text-2xl font-bold">ر</span>
        </div>
        {/* Decorative ring */}
        <div className="absolute -inset-1 border-2 border-soft-gold/30 rounded-2xl" />
      </div>
      {showText && (
        <h1 className={`${text} font-bold text-primary-green mt-3 font-arabic gold-text`}>
          Rafiq
        </h1>
      )}
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LogoContent />
      </motion.div>
    )
  }

  return <LogoContent />
}

export default Logo