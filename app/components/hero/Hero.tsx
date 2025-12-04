// T029 & T034 & T036: Hero section container with animation and responsive styling

'use client'

import { motion } from 'framer-motion'
import { HeroHeadline } from './HeroHeadline'
import { HeroSubhead } from './HeroSubhead'
import { CTAButtons } from './CTAButtons'
import { getProfile } from '@/lib/data/cv-loader'
import { ANIMATION } from '@/lib/constants'

export function Hero() {
  const profile = getProfile()

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="flex min-h-[90vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION.HERO_FADE_IN }}
        className="mx-auto max-w-4xl text-center"
      >
        <div className="space-y-8">
          <HeroHeadline name={profile.name} title={profile.title} />
          <HeroSubhead summary={profile.summary} />
          <CTAButtons />
        </div>
      </motion.div>
    </section>
  )
}
