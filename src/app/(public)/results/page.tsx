"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Award,
  BarChart3,
  MessageSquare,
  AlertCircle,
  Shield,
  BookOpen,
  BadgeCheck,
  Printer,
} from "lucide-react";

interface APIResponse {
  student: {
    firstName: string;
    lastName: string;
    level: string | null;
    program: string | null;
  };
  results: {
    examSession: {
      title: string;
      examDate: string;
      level: string | null;
    };
    score: number;
    maxScore: number;
    percentage: number;
    status: string;
    teacherComment: string | null;
    certificateAvailable: boolean;
  }[];
}

export default function ResultsPage() {
  const [studentId, setStudentId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<APIResponse | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    setSearched(true);

    try {
      const res = await fetch("/api/results/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, dateOfBirth }),
      });

      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else if (res.status === 404) {
        const json = await res.json();
        setError(
          json.error ||
            "No results found. Please verify your Student ID and date of birth."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
    } catch {
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
              top: "-10%",
              right: "10%",
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
            Exam Results
          </motion.span>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Check Your <span className="text-white/90">Results</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Enter your Student ID and date of birth to view your exam results
            securely.
          </motion.p>
        </div>
      </section>

      {/* Results form */}
      <section className="relative py-16 lg:py-24 bg-cream dark:bg-slate-800 noise-overlay">
        <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6">
          <motion.div
            className="no-print bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-burgundy flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-navy dark:text-white">
                Look Up Your Results
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Enter your credentials below to access your exam results
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="studentId"
                  className="block text-sm font-semibold text-navy dark:text-white mb-2"
                >
                  Student ID
                </label>
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g., TLC250001"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div>
                <label
                  htmlFor="dob"
                  className="block text-sm font-semibold text-navy dark:text-white mb-2"
                >
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-burgundy focus:ring-2 focus:ring-burgundy/20 outline-none transition-all duration-300 text-navy dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3.5 rounded-xl gradient-burgundy text-white font-semibold text-lg hover:shadow-lg hover:shadow-burgundy/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Check Results
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Result display */}
          {searched && !loading && data && (
            <motion.div
              className="mt-8 space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Student info card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl gradient-burgundy flex items-center justify-center">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-navy dark:text-white">
                        {data.student.firstName} {data.student.lastName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        {data.student.program && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {data.student.program}
                          </span>
                        )}
                        {data.student.level && (
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3.5 h-3.5" />
                            {data.student.level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="no-print flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                    aria-label="Print results"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                </div>

                {data.results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="font-medium">No exam results available yet.</p>
                    <p className="text-sm mt-1">Results will appear here once your exams have been graded.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {data.results.map((result, index) => {
                      const passed = result.status === "passed" || result.status === "Passed";
                      return (
                        <motion.div
                          key={index}
                          className="border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {/* Status banner */}
                          <div
                            className={`p-4 flex items-center gap-3 ${
                              passed
                                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {passed ? (
                              <CheckCircle className="w-6 h-6 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-6 h-6 flex-shrink-0" />
                            )}
                            <span className="font-semibold text-lg">
                              {passed
                                ? "Congratulations! You passed!"
                                : "Unfortunately, you did not pass this time."}
                            </span>
                          </div>

                          <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-cream dark:bg-slate-800 rounded-xl">
                              <Calendar className="w-5 h-5 text-burgundy flex-shrink-0" />
                              <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Exam Session</div>
                                <div className="font-semibold text-navy dark:text-white">
                                  {result.examSession.title}
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                  {formatDate(result.examSession.examDate)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-cream dark:bg-slate-800 rounded-xl">
                              <Award className="w-5 h-5 text-burgundy flex-shrink-0" />
                              <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                                <div className="font-semibold text-navy dark:text-white text-lg">
                                  {result.score} / {result.maxScore}{" "}
                                  <span
                                    className={`text-base ${
                                      passed ? "text-emerald-600" : "text-red-600"
                                    }`}
                                  >
                                    ({result.percentage}%)
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="px-3">
                              <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${
                                    passed
                                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                      : "bg-gradient-to-r from-red-400 to-red-500"
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${result.percentage}%`,
                                  }}
                                  transition={{
                                    duration: 1,
                                    delay: 0.3,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>

                            {result.teacherComment && (
                              <div className="flex items-start gap-3 p-3 bg-cream dark:bg-slate-800 rounded-xl">
                                <MessageSquare className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Teacher Comment
                                  </div>
                                  <div className="text-navy dark:text-white text-sm leading-relaxed">
                                    {result.teacherComment}
                                  </div>
                                </div>
                              </div>
                            )}

                            {result.certificateAvailable && (
                              <div className="flex items-center gap-3 p-3 bg-burgundy/10 dark:bg-burgundy/20 rounded-xl border border-burgundy/20">
                                <BadgeCheck className="w-5 h-5 text-burgundy flex-shrink-0" />
                                <div className="text-sm font-medium text-navy dark:text-white">
                                  Certificate available — contact the front desk to collect it.
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Error display */}
          {searched && !loading && error && (
            <motion.div
              className="mt-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 text-amber-600">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Privacy notice */}
          <motion.div
            className="no-print mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
              <Shield className="w-4 h-4" />
              <p>
                Your information is secure. Results are only accessible with
                your Student ID and date of birth. We do not share personal data
                with third parties.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
