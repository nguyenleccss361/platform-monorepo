import { motion } from 'framer-motion'
import type React from 'react'

export const AnimatedWrapper = ({ children }: { children?: React.JSX.Element | React.JSX.Element[] }) => {
  return (
    <motion.div
      className="flex h-full flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      // custom={{ direction: 'forward' }}
      // initial="initial"
      // animate="in"
      // exit="out"
      // variants={MOTION_VARIANTS}
    >
      {children}
    </motion.div>
  )
}
