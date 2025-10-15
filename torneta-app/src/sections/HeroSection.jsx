import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function HeroSection() {
  return (
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
          <div className="relative w-full max-w-md rounded-3xl border border-neutral-200 bg-gradient-card p-6 shadow-card">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-500">AI Visibility Score</p>
                <p className="text-4xl font-semibold text-neutral-900">82</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Live</span>
            </div>
            <div className="space-y-4">
              {['ChatGPT', 'Gemini', 'Claude', 'Perplexity'].map((model) => (
                <div key={model} className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{model}</p>
                    <p className="text-xs text-neutral-500">Visibility percentile</p>
                  </div>
                  <span className="text-lg font-semibold text-primary">+12%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
