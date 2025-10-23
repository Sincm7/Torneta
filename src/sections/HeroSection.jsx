import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function HeroSection() {
  const averageScore = 6.5;
  const [selectedModel, setSelectedModel] = useState(null);
  
  // Calculate indicator color based on score
  const getIndicatorColor = (score) => {
    if (score <= 2.5) return '#FF4D4D'; // Red
    if (score <= 5) return '#FFD633';   // Yellow
    if (score <= 7.5) return '#FFA500'; // Orange
    return '#4CAF50'; // Green
  };

  // Model data with specific suggestions and competitors
  const models = [
    { 
      id: 'chatgpt', 
      name: 'ChatGPT 4.1', 
      score: '6.1',
      suggestions: [
        'Strengthen meta tags for AI readability',
        'Add schema markup for product context',
        'Optimize homepage for conversational queries'
      ],
      competitors: [
        'Notion AI',
        'Zapier',
        'HubSpot'
      ]
    },
    { 
      id: 'gemini', 
      name: 'Gemini 2.5', 
      score: '8.2',
      suggestions: [
        'Increase brand mentions across partner domains',
        'Add FAQ sections for AI-rich snippets',
        'Enhance author credibility signals (E-E-A-T)'
      ],
      competitors: [
        'Canva',
        'Grammarly',
        'Trello'
      ]
    },
    { 
      id: 'deepseek', 
      name: 'DeepSeek 3.1', 
      score: '5.9',
      suggestions: [
        'Reduce duplicate content in long-form pages',
        'Add semantic keywords to blog metadata',
        'Refactor internal links for better crawl depth'
      ],
      competitors: [
        'Ahrefs',
        'SEMrush',
        'Moz'
      ]
    },
    { 
      id: 'claude', 
      name: 'Claude 3.5', 
      score: '6.0',
      suggestions: [
        'Simplify landing page language for AI clarity',
        'Add accessible alt text to all visuals',
        'Ensure consistent brand tone across content'
      ],
      competitors: [
        'Jasper',
        'Writesonic',
        'Copy.ai'
      ]
    },
  ];

  return (
    <>
      <style>
        {`
          @keyframes gradient-x {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 4s ease infinite;
          }
        `}
      </style>
      <section className="relative overflow-hidden bg-white">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-24 pt-20 text-center sm:px-6 lg:flex-row lg:items-start lg:gap-16 lg:text-left lg:pt-28 lg:px-8">
        <motion.div
          className="flex-1 space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <motion.div custom={0} variants={fadeUp}>
            <span className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              AI Visibility Platform
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              Be Seen by AI.
            </h1>
          </motion.div>

          <motion.p
            custom={0.1}
            variants={fadeUp}
            className="max-w-xl text-lg leading-relaxed text-neutral-600 sm:text-xl"
          >
            Torneta helps your brand become visible inside AI-generated responses — the future of SEO is AIRO.
          </motion.p>

          <motion.div
            custom={0.2}
            variants={fadeUp}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              to="/demo"
              className="w-full rounded-full bg-neutral-900 px-8 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-neutral-900/10 transition hover:-translate-y-1 hover:bg-neutral-800 sm:w-auto"
            >
              Get Free Demo
            </Link>
            <Link
              to="/signup"
              className="w-full rounded-full border border-neutral-300 px-8 py-3 text-center text-sm font-semibold text-neutral-900 transition hover:border-neutral-900 hover:text-neutral-900 sm:w-auto"
            >
              Sign Up
            </Link>
          </motion.div>

          <motion.div custom={0.3} variants={fadeUp} className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-12">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10" />
              <p className="text-left text-sm text-neutral-500">
                Trusted by teams ready to win the AI search race.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-900/5" />
              <p className="text-left text-sm text-neutral-500">Insert partner logos or social proof badges here.</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-1 justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-neutral-200 bg-gradient-card p-8 shadow-card">
            {/* Average Score Section */}
            <div className="mb-8 text-center">
              <h3 className="text-lg font-bold text-center">
                <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
                  AIRO
                </span>{' '}
                <span className="text-neutral-900">Score</span>
              </h3>
              <div className="mt-2 text-5xl font-bold text-neutral-900">{averageScore}</div>
              <p className="mt-1 text-sm text-neutral-600">Well-Optimized</p>
              
              {/* Score Range Bar */}
              <div className="mt-4 flex justify-center">
                <div className="relative w-64 h-1.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500">
                  <div
                    className="absolute top-0 h-3 w-0.5 rounded-full -translate-y-1 transition-all duration-500 ease-out"
                    style={{ 
                      left: `${(averageScore / 10) * 100}%`,
                      backgroundColor: getIndicatorColor(averageScore)
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Model Scores Section */}
            {!selectedModel ? (
              <motion.div 
                className="mb-8 grid grid-cols-2 gap-3"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {models.map((model) => (
                  <motion.div 
                    key={model.id}
                    className="rounded-2xl bg-white/80 p-4 text-center shadow-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md"
                    onClick={() => setSelectedModel(model.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <p className="text-xs font-medium text-neutral-600">{model.name} Score</p>
                    <p className="mt-1 text-xl font-bold text-primary">{model.score}</p>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="mb-8"
              >
                {/* Selected Model Display */}
                <motion.div 
                  className="rounded-2xl bg-white/80 p-6 text-center shadow-sm mb-6"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium text-neutral-600">
                    {models.find(m => m.id === selectedModel)?.name} Score
                  </p>
                  <p className="mt-2 text-3xl font-bold text-primary">
                    {models.find(m => m.id === selectedModel)?.score}
                  </p>
                </motion.div>

                {/* Details Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="grid grid-cols-2 gap-6 mb-6"
                >
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-neutral-900">Suggestions</h4>
                    <ul className="space-y-2 text-xs text-neutral-600">
                      {models.find(m => m.id === selectedModel)?.suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-neutral-900">Competitors</h4>
                    <ul className="space-y-2 text-xs text-neutral-600">
                      {models.find(m => m.id === selectedModel)?.competitors.map((competitor, index) => (
                        <li key={index}>• {competitor}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Back Button */}
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <button
                    onClick={() => setSelectedModel(null)}
                    className="bg-primary hover:bg-primary-dark text-white font-medium rounded-full px-6 py-2 transition-all duration-300 hover:scale-105 shadow-sm"
                  >
                    Back
                  </button>
                </motion.div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
}
