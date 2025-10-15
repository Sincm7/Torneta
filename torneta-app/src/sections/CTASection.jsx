import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-white to-white" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-white/80 p-12 text-center shadow-card"
      >
        <h3 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          Build your AI visibility playbook with Torneta.
        </h3>
        <p className="mt-5 text-lg leading-relaxed text-neutral-600">
          Get the analytics, strategic guidance, and integrations your team needs to appear inside the next generation of
          AI-driven discovery.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/demo"
            className="w-full rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-1 hover:bg-primary-dark sm:w-auto"
          >
            Book a Strategy Call
          </Link>
          <Link
            to="/pricing"
            className="w-full rounded-full border border-neutral-300 px-8 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900 sm:w-auto"
          >
            Explore Plans
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
