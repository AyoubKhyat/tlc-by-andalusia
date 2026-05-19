"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <>
      <section className="relative py-28 lg:py-36 gradient-hero overflow-hidden noise-overlay moroccan-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            className="text-lg text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            How we handle and protect your personal information.
          </motion.p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-cream dark:bg-slate-900 relative noise-overlay">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 sm:p-12 border border-gray-100 dark:border-slate-700 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">1. Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                When you register or contact us, we collect your name, email address, phone number, and optionally a parent/guardian name and phone number. We also collect information about your program interest and any messages you send through our contact form.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We use your information to process registrations, communicate about programs and schedules, share exam results securely, and send updates about TLC activities if you subscribe to our newsletter. We do not sell or share your personal data with third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">3. Data Security</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We implement appropriate security measures to protect your personal information. Exam results are accessible only through a secure lookup requiring both your Student ID and date of birth.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">4. Cookies</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our website uses essential cookies for functionality such as language preference and theme settings. These cookies are stored locally on your device and are not used for tracking or advertising.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">5. Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                You may request access to, correction of, or deletion of your personal data at any time by contacting us at contact@tlc-marrakech.com or calling 0643 43 43 82.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">6. Contact</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                For any privacy-related questions, contact TLC by Andalusia Academy at Rue Prestige Targa 1, Marrakech, or email contact@tlc-marrakech.com.
              </p>
            </div>

            <p className="text-sm text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-slate-700">
              Last updated: May 2026
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
