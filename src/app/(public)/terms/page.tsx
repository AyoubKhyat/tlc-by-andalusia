"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
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
            Terms of Service
          </motion.h1>
          <motion.p
            className="text-lg text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Terms and conditions for using our services.
          </motion.p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-cream dark:bg-slate-900 relative noise-overlay">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 sm:p-12 border border-gray-100 dark:border-slate-700 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">1. Enrollment & Registration</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Registration is confirmed upon submission of the enrollment form and receipt of payment. Spots are reserved on a first-come, first-served basis and are subject to availability. Class placement may depend on the results of a placement test.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">2. Payment & Fees</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Tuition fees are due at the time of enrollment. Fees cover instruction, course materials provided in class, and access to our facilities during scheduled class hours. Additional exam preparation materials may require a separate fee.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">3. Attendance & Conduct</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Regular attendance is essential for language learning progress. Students are expected to attend all scheduled sessions and maintain respectful behavior toward instructors and fellow students. TLC reserves the right to dismiss students who disrupt the learning environment.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">4. Cancellation & Refunds</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Cancellations made more than 7 days before the program start date are eligible for a full refund. Cancellations within 7 days of the start date may be subject to a cancellation fee. No refunds are issued once the program has begun.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">5. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                All course materials, content, and branding used by TLC by Andalusia Academy are proprietary. Materials provided during courses are for personal educational use only and may not be reproduced or distributed without written permission.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">6. Liability</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                TLC by Andalusia Academy is not liable for personal belongings lost or damaged on premises. Parents and guardians are responsible for minors outside of scheduled class hours.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy dark:text-white mb-3">7. Changes to Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We reserve the right to update these terms at any time. Continued enrollment after changes constitutes acceptance of the updated terms.
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
