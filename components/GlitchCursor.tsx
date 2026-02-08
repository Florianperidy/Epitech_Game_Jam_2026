'use client'

import { useEffect } from 'react'

export default function GlitchCursor() {
  useEffect(() => {
    const triggerGlitch = () => {
      document.body.classList.add('cursor-glitch')

      setTimeout(() => {
        document.body.classList.remove('cursor-glitch')
      }, 2000 + Math.random() * 1000)
    }

    const scheduleNextGlitch = () => {
      const delay = 500 + Math.random() * 1000
      setTimeout(() => {
        triggerGlitch()
        scheduleNextGlitch()
      }, delay)
    }

    scheduleNextGlitch()

    return () => {
      document.body.classList.remove('cursor-glitch')
    }
  }, [])

  return null
}
