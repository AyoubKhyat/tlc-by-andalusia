"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

type FAQCategory = "all" | "general" | "programs" | "exams" | "registration" | "payment";

interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
}

const categoryTabs: { key: FAQCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "general", label: "General" },
  { key: "programs", label: "Programs" },
  { key: "exams", label: "Exams" },
  { key: "registration", label: "Registration" },
  { key: "payment", label: "Payment" },
];

const faqItems: FAQItem[] = [
  {
    question: "What is TLC by Andalusia Academy?",
    answer:
      "TLC (The Language Center) by Andalusia Academy is a premier language learning institution based in Marrakech. We specialize in English language education using the communicative approach, and also offer Arabic, French, and Italian programs. Our mission is to help learners of all ages communicate confidently and naturally.",
    category: "general",
  },
  {
    question: "Where is TLC located?",
    answer:
      "We are located at Rue Prestige Targa 1, Marrakech. Our center is easily accessible and situated in a calm, professional environment ideal for focused learning. You can reach us by phone at 0643 43 43 82.",
    category: "general",
  },
  {
    question: "What are your opening hours?",
    answer:
      "Our morning sessions run on Saturday and Sunday from 9h to 11h. Afternoon sessions are held Monday through Thursday from 17h to 19h. We recommend contacting us for the most up-to-date schedule information.",
    category: "general",
  },
  {
    question: "What age groups do you serve?",
    answer:
      "We offer programs for learners starting from age 7 and above. Our programs are organized into Kids (7-9), Juniors (10-14), Teens (15-17), and Adults (18+). Each program is tailored to the specific developmental stage and learning needs of its age group.",
    category: "programs",
  },
  {
    question: "How long does each course level last?",
    answer:
      "Most of our regular English programs run in 3-month cycles per level. Exam preparation courses (TOEFL, IELTS, TOEIC) typically last 2-3 months depending on the student's starting level and target score. Conversation classes are offered on an ongoing basis.",
    category: "programs",
  },
  {
    question: "What levels do you offer?",
    answer:
      "Our programs cover the full spectrum of the Common European Framework of Reference (CEFR), from A1 (absolute beginner) to C1 (advanced). The specific levels available depend on the program: Kids start with Starter/Beginner levels, while adult programs cover A1 through C1.",
    category: "programs",
  },
  {
    question: "How are classes structured?",
    answer:
      "We maintain small class sizes of 12-15 students maximum to ensure personalized attention and maximum speaking opportunities. Each class follows a communicative approach with interactive activities, pair work, group discussions, role-plays, and real-world practice scenarios.",
    category: "programs",
  },
  {
    question: "Is there a placement test?",
    answer:
      "Yes, every new student takes a placement test before starting. This comprehensive assessment evaluates grammar, vocabulary, listening, and speaking skills to place you in the right level. The test is free of charge, and results are typically available within 24 hours.",
    category: "exams",
  },
  {
    question: "How can I check my exam results?",
    answer:
      "You can check your exam results through our website by visiting the 'Exam Results' page. You will need your Student ID and date of birth to access your results securely. If you have any issues, please contact our administration team.",
    category: "exams",
  },
  {
    question: "Do you offer certificates?",
    answer:
      "Yes, students who successfully complete a level and pass the final exam receive an official TLC certificate indicating their achieved CEFR level. These certificates are recognized and valued by schools and employers. We also prepare students for internationally recognized exams like TOEFL, IELTS, and TOEIC.",
    category: "exams",
  },
  {
    question: "What is the final exam like?",
    answer:
      "The final exam is a comprehensive assessment covering all four language skills: reading, writing, listening, and speaking. It is designed to evaluate your overall progress throughout the level. Students receive a detailed score breakdown and teacher feedback after the exam.",
    category: "exams",
  },
  {
    question: "How do I register for a course?",
    answer:
      "You can register by filling out the registration form on our Contact page, calling us at 0643 43 43 82, or messaging us on WhatsApp. You can also visit our center in person at Rue Prestige Targa 1, Marrakech. After registration, you will be scheduled for a placement test.",
    category: "registration",
  },
  {
    question: "Can I switch levels or programs after starting?",
    answer:
      "Yes, if your teacher and our academic coordinator determine that your current level is not the best fit, we can arrange a transfer to a more appropriate level. We prioritize placing students where they will learn most effectively and feel appropriately challenged.",
    category: "registration",
  },
  {
    question: "What are the payment options?",
    answer:
      "We offer flexible payment options including full payment at registration and installment plans for longer programs. Please contact our administration team for current pricing and available payment methods. We strive to make quality language education accessible to all.",
    category: "payment",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Refund requests are handled on a case-by-case basis. If you need to withdraw from a course, please contact our administration as soon as possible. Refund eligibility depends on the timing of the request and the portion of the course completed. Details are provided at the time of registration.",
    category: "payment",
  },
  {
    question: "Are there any discounts available?",
    answer:
      "We occasionally offer discounts for early registration, siblings, and returning students. We also run promotional offers during specific enrollment periods. Follow us on social media or contact us directly to learn about current offers and special pricing.",
    category: "payment",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
      layout
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-cream/50 transition-colors duration-200"
      >
        <span className="font-semibold text-navy pr-4 text-sm sm:text-base">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-burgundy" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const filteredItems = faqItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-28 lg:py-36 gradient-hero overflow-hidden noise-overlay moroccan-pattern">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, rgba(122,31,62,0.4) 0%, transparent 70%)",
              top: "10%",
              right: "-5%",
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span
            className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white border border-white/30 bg-white/10 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            FAQ
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Frequently Asked <span className="text-white/90">Questions</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find answers to the most common questions about our programs,
            registration, and more.
          </motion.p>
        </div>
      </section>

      {/* FAQ Content */}
      <section ref={ref} className="py-16 lg:py-24 bg-cream relative overflow-hidden noise-overlay">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Search */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy placeholder:text-gray-400 bg-white"
              />
            </div>
          </motion.div>

          {/* Category tabs */}
          <motion.div
            className="flex flex-wrap gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {categoryTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeCategory === tab.key
                    ? "gradient-burgundy text-white shadow-md"
                    : "bg-white text-navy hover:bg-burgundy/10 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* FAQ items */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <AccordionItem
                    item={item}
                    isOpen={openItems.has(index)}
                    onToggle={() => toggleItem(index)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center py-12 bg-white rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  No questions match your search.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adjusting your search terms or category filter.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-12 text-center bg-white rounded-2xl p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-navy mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Cannot find the answer you are looking for? Reach out to our
              friendly team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl gradient-burgundy text-white font-semibold hover:shadow-lg hover:shadow-burgundy/20 transition-all duration-300 text-sm"
              >
                Contact Us
              </a>
              <a
                href="https://wa.me/212643434382"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl border-2 border-burgundy text-burgundy font-semibold hover:bg-burgundy hover:text-white transition-all duration-300 text-sm"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
