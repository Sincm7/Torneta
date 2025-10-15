import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Analyze',
    description:
      'Ingest your content, keywords, and competitive signals. Torneta maps where and how AI assistants mention your brand today.',
    icon: '📊',
  },
  {
    title: 'Score',
    description:
      'Get an AIRO Score for each assistant with guidance on coverage gaps, authority factors, and conversation triggers.',
    icon: '⭐',
  },
  {
    title: 'Optimize',
    description:
      'Deploy tailored briefs, structured datasets, and integration-ready prompts to climb the rankings within AI generated answers.',
    icon: '🚀',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-24">
      {/* Section heading */}
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center sm:px-6 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary"
        >
          How it works
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl"
        >
          From invisible to AI-ready in three moves.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="max-w-2xl text-lg leading-relaxed text-neutral-600"
        >
          Torneta blends performance analytics, AI ecosystem intelligence, and actionable playbooks to help your brand show up in
          the conversations that matter.
        </motion.p>
      </div>

      {/* Steps */}
      <div className="mx-auto mt-16 grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            className="group flex flex-col rounded-3xl border border-neutral-200 bg-white/70 p-8 shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
          >
            <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
              {step.icon}
            </span>
            <h3 className="text-xl font-semibold text-neutral-900">{step.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
