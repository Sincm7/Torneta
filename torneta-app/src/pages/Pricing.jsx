import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started and understanding your baseline AI visibility.',
    features: [
      '1 brand workspace',
      'Monthly AIRO Score refresh',
      'ChatGPT + Gemini snapshot',
      'Basic optimization checklist',
    ],
  },
  {
    name: 'Pro',
    price: '$249',
    description: 'For growth teams ready to monitor multiple assistants and deploy improvements weekly.',
    features: [
      '3 brand workspaces',
      'Weekly AIRO Score refresh',
      'ChatGPT, Gemini, Claude & Perplexity',
      'Automated optimization playbooks',
      'Shareable reporting dashboard',
    ],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Let’s Talk',
    description: 'For global brands needing bespoke integrations, governance, and premium support.',
    features: [
      'Unlimited workspaces & seats',
      'Daily AIRO Score + alerting',
      'Custom AI integrations & APIs',
      'Dedicated strategist & workshops',
      'Security reviews & SSO readiness',
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary"
        >
          Pricing
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl"
        >
          Choose the plan that keeps your brand in the conversation.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600"
        >
          Simple, transparent pricing designed for marketing and communications teams building AI visibility from day one to
          global scale.
        </motion.p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`group relative flex flex-col rounded-3xl border border-neutral-200 bg-white/70 p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-card ${
              plan.highlight ? 'ring-2 ring-primary/60' : ''
            }`}
          >
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 opacity-0 transition group-hover:opacity-100" />
            {plan.highlight && (
              <span className="absolute right-6 top-6 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Most Popular
              </span>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-neutral-900">{plan.name}</h2>
              <p className="mt-3 text-4xl font-semibold text-neutral-900">{plan.price}</p>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">{plan.description}</p>
              <ul className="mt-8 space-y-3 text-left text-sm text-neutral-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/signup"
              className={`mt-10 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                plan.highlight
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-1 hover:bg-primary-dark focus-visible:outline-primary'
                  : 'border border-neutral-300 text-neutral-900 hover:border-neutral-900 focus-visible:outline-neutral-900'
              }`}
            >
              Get Started
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-4xl rounded-3xl border border-neutral-200 bg-neutral-50/80 p-10 text-center">
        <h3 className="text-2xl font-semibold text-neutral-900">Need a custom rollout?</h3>
        <p className="mt-4 text-base leading-relaxed text-neutral-600">
          Connect with our team for co-marketing opportunities, onboarding support, and roadmap alignment with your AI
          governance standards.
        </p>
        <Link
          to="/demo"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10"
        >
          Talk to Sales
        </Link>
      </div>
    </div>
  );
}
