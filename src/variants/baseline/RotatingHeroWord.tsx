import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

const ROTOR_WORDS = ['duplicates', 'old versions', 'sensitive files', 'stale docs'] as const
const ROTOR_MEASURE_WORD = 'sensitive files'
const ROTOR_INTERVAL_MS = 2460

export function RotatingHeroWord() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % ROTOR_WORDS.length)
    }, ROTOR_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [reduceMotion])

  const word = ROTOR_WORDS[reduceMotion ? 0 : index]

  return (
    <span className="rotor" aria-label={ROTOR_WORDS.join(', ')}>
      <span className="rotor-measure" aria-hidden="true">
        {ROTOR_MEASURE_WORD}
      </span>
      <span className="rotor-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={word}
            className="rot-word"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}
