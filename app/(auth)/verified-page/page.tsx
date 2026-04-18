'use client'

import { Button } from '@/components/ui/button'
import { App_url } from '@/constant/static'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EmailVerifiedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#CFE0FF] via-[#EAF1FF] to-white px-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center"
      >
        {/* Animated Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
        >
          <CheckCircle className="text-green-600" size={40} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold font-manrope text-black"
        >
          Email Verified Successfully!
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-md font-instrument_sans text-text_gray_color leading-relaxed"
        >
          Your email address has been successfully verified.
          You can now explore properties and access your account.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={() => router.push(App_url.link.INITIAL_URL)}
            className="mt-8 w-full font-instrument_sans rounded-full bg-[#136AED] h-12 text-sm font-normal tracking-wider text-white shadow-lg transition"
          >
            Go to Homepage
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}