import { motion } from 'framer-motion';

const stats = [
  { value: '3.2x', label: 'Increase in AI-driven mentions after 60 days.' },
  { value: '45+', label: 'AI surfaces, search agents, and LLM ecosystems monitored.' },
  { value: '98%', label: 'Clients reporting clearer AI roadmap visibility.' },
];

export default function StatsSection() {
  return (
    <section className="bg-neutral-50 py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-neutral-200 bg-white/80 p-10 shadow-sm"
        >
          <div className="grid gap-8 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <p className="text-4xl font-semibold text-neutral-900">{stat.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-3xl border border-neutral-200 bg-white/80 p-10 shadow-sm"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-lg leading-relaxed text-neutral-700">
                “This is the perfect spot for a marquee testimonial. Swap in your favorite customer quote about taking control of
                AI conversations and seeing measurable lift in brand coverage.”
              </p>
              <div className="mt-4 text-sm font-semibold text-neutral-900">Replace with Customer Name, Title</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10" />
              <div className="text-sm text-neutral-500">Upload client avatar and company mark.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
