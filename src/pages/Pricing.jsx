import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started and understanding your baseline AI visibility.',
    tagline: 'Monthly AIRO refresh, 1 brand workspace.',
    features: [
      '1 brand workspace',
      'Monthly AIRO Score refresh',
      'ChatGPT + Gemini snapshot',
      'Basic optimization checklist',
    ],
    benefits: [
      '🔹 1 brand workspace',
      '🔹 Monthly AIRO refresh',
      '🔹 ChatGPT + Gemini snapshot',
    ],
    report: [
      { label: 'AIRO Score', value: 48, accent: 'from-blue-300 to-blue-600' },
      { label: 'ChatGPT', value: 52, accent: 'from-sky-300 to-sky-500' },
      { label: 'Gemini', value: 58, accent: 'from-emerald-300 to-emerald-500' },
    ],
  },
  {
    name: 'Pro',
    price: '$249',
    description: 'For growth teams ready to monitor multiple assistants and deploy improvements weekly.',
    tagline: 'Weekly AIRO Score refresh, 3 brand workspaces.',
    features: [
      '3 brand workspaces',
      'Weekly AIRO Score refresh',
      'ChatGPT, Gemini, Claude & Perplexity',
      'Automated optimization playbooks',
      'Shareable reporting dashboard',
    ],
    benefits: [
      '🔹 Automated optimization playbooks',
      '🔹 Multi-AI monitoring (GPT, Gemini, Claude, Perplexity)',
      '🔹 Shareable reporting dashboards',
    ],
    report: [
      { label: 'AIRO Score', value: 72, accent: 'from-blue-400 to-indigo-500' },
      { label: 'Gemini', value: 82, accent: 'from-green-400 to-emerald-500' },
      { label: 'ChatGPT', value: 61, accent: 'from-sky-400 to-blue-500' },
      { label: 'Claude', value: 64, accent: 'from-violet-400 to-purple-500' },
    ],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Let’s Talk',
    description: 'For global brands needing bespoke integrations, governance, and premium support.',
    tagline: 'Daily AIRO Score refresh, unlimited workspaces & API access.',
    features: [
      'Unlimited workspaces & seats',
      'Daily AIRO Score + alerting',
      'Custom AI integrations & APIs',
      'Dedicated strategist & workshops',
      'Security reviews & SSO readiness',
    ],
    benefits: [
      '🔹 Unlimited workspaces & API access',
      '🔹 Daily AIRO Score + alerting',
      '🔹 SSO-ready enterprise dashboard',
    ],
    report: [
      { label: 'AIRO Score', value: 88, accent: 'from-blue-500 to-cyan-500' },
      { label: 'Gemini', value: 90, accent: 'from-teal-400 to-emerald-500' },
      { label: 'ChatGPT', value: 76, accent: 'from-sky-400 to-blue-600' },
      { label: 'Claude', value: 82, accent: 'from-purple-400 to-fuchsia-500' },
      { label: 'DeepSeek', value: 74, accent: 'from-orange-400 to-amber-500' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const activePlan = useMemo(
    () => plans.find((plan) => plan.name === selectedPlan) ?? null,
    [selectedPlan]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedPlan(null);
      }
      if ((event.key === 'Enter' || event.key === ' ') && selectedPlan) {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlan]);

  return (
    <div className="relative min-h-screen bg-white pb-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-primary/10 via-white to-white" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-4 pt-20 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!selectedPlan && (
            <motion.div
              key="pricing-header"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.55 }}
              className="max-w-4xl text-center"
            >
              <span className="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Pricing
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
                Choose the plan that keeps your brand in the conversation.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
                Simple, transparent pricing designed for marketing and communications teams building AI visibility from day one to
                global scale.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mt-16 flex w-full flex-1 items-center justify-center">
          <AnimatePresence mode="wait">
            {!selectedPlan && (
              <motion.div
                key="plan-grid"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5 }}
                className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3"
              >
                {plans.map((plan) => (
                  <motion.button
                    key={plan.name}
                    layoutId={`plan-${plan.name}`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`group relative flex h-full flex-col rounded-3xl border border-neutral-200 bg-white/80 p-8 text-left shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      plan.highlight ? 'ring-2 ring-primary/40' : ''
                    }`}
                  >
                    <span className="sr-only">View {plan.name} plan details</span>
                    <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 opacity-0 transition group-hover:opacity-100" />
                    {plan.highlight && (
                      <span className="absolute right-6 top-6 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        Most Popular
                      </span>
                    )}
                    <div className="flex flex-1 flex-col">
                      <h2 className="text-xl font-semibold text-neutral-900">{plan.name}</h2>
                      <p className="mt-3 text-4xl font-semibold text-neutral-900">{plan.price}</p>
                      <p className="mt-4 text-sm leading-relaxed text-neutral-600">{plan.description}</p>
                      <ul className="mt-8 space-y-3 text-sm text-neutral-600">
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
                    <span className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Explore plan
                      <motion.span
                        aria-hidden
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 text-xs"
                        initial={{ x: 0 }}
                        animate={{ x: 3 }}
                        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.4 }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activePlan && (
              <motion.div
                key={`plan-expanded-${activePlan.name}`}
                layoutId={`plan-${activePlan.name}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-blue-50 to-blue-100/70 px-6 py-10 text-neutral-900 shadow-2xl sm:px-12 md:min-h-[calc(100vh-12rem)]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.45 }}
                  className="flex flex-col gap-4 text-center sm:text-left"
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{activePlan.name} Plan</span>
                  <h2 className="text-4xl font-semibold sm:text-5xl">
                    {activePlan.name === 'Pro'
                      ? 'Pro Plan — For Growth Teams'
                      : activePlan.name === 'Enterprise'
                      ? 'Enterprise Plan — Enterprise-Ready Intelligence'
                      : 'Free Plan — Kickstart Your Visibility'}
                  </h2>
                  <div className="flex flex-col items-center gap-3 text-base text-neutral-600 sm:flex-row sm:gap-6">
                    <div className="rounded-full border border-primary/20 bg-white/80 px-5 py-2 text-sm font-semibold text-primary">
                      {activePlan.price}
                    </div>
                    <p className="max-w-xl text-center text-neutral-600 sm:text-left">{activePlan.tagline}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
                >
                  <div className="space-y-8">
                    <div className="rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur">
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">AI Visibility Report Preview</h3>
                          <p className="text-sm text-neutral-500">Mock performance snapshot for your workspace</p>
                        </div>
                        <div className="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                          {activePlan.name === 'Free'
                            ? 'Monthly'
                            : activePlan.name === 'Pro'
                            ? 'Weekly'
                            : 'Daily'}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {activePlan.report.map((metric) => (
                          <div key={metric.label}>
                            <div className="flex items-center justify-between text-sm font-medium text-neutral-600">
                              <span>{metric.label}</span>
                              <span className="text-neutral-900">{metric.value}</span>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-neutral-200/80">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${metric.accent}`}
                                style={{ width: `${Math.min(metric.value, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-primary/20 bg-white/70 p-6 shadow-md backdrop-blur">
                      <h4 className="text-lg font-semibold text-neutral-900">What’s Included</h4>
                      <ul className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600">
                        {activePlan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              ✓
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-8">
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="rounded-3xl bg-primary/10 p-8 text-sm leading-relaxed text-primary/80 shadow-inner"
                    >
                      <p className="text-base font-semibold text-primary/90">Why teams choose the {activePlan.name} plan</p>
                      <ul className="mt-5 space-y-3 text-neutral-700">
                        {activePlan.benefits.map((benefit) => (
                          <li key={benefit}>{benefit}</li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.55 }}
                      className="flex flex-col gap-4 rounded-3xl bg-white/80 p-6 text-center shadow-lg backdrop-blur"
                    >
                      <p className="text-sm text-neutral-500">Ready to see Torneta in action?</p>
                      <Link
                        to={activePlan.name === 'Enterprise' ? '/demo' : '/signup'}
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {activePlan.name === 'Enterprise' ? 'Talk to Sales' : 'Start with this plan'}
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="mt-12 inline-flex items-center self-center rounded-full bg-gradient-to-r from-blue-500 to-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ delay: 0.4, duration: 0.45 }}
                >
                  ← Back to all plans
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
