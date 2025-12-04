// T063 & T071: Contact section container component

'use client'

import { motion } from 'framer-motion'
import { ContactInfo } from './ContactInfo'
import { SocialLinks } from './SocialLinks'
import { getProfile } from '@/lib/data/cv-loader'
import { ANIMATION } from '@/lib/constants'

export function Contact() {
  const profile = getProfile()

  return (
    <section id="contact" aria-label="Contact information" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION.PROJECT_SLIDE }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Get in Touch</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Let's discuss how I can help with your next project
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION.PROJECT_SLIDE, delay: 0.1 }}
          className="rounded-xl border bg-card p-8 shadow-sm"
        >
          <div className="grid gap-8 md:grid-cols-2">
            {/* Contact Info - Location */}
            <ContactInfo location={profile.location} />

            {/* Social Links - Email, Phone, LinkedIn */}
            <SocialLinks contact={profile.contact} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
