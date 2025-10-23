import { useEffect, useState } from 'react';
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
    report: [
      { label: 'AIRO Score', value: 45 },
      { label: 'ChatGPT', value: 38 },
      { label: 'Gemini', value: 52 },
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
    report: [
      { label: 'AIRO Score', value: 72 },
      { label: 'Gemini', value: 82 },
      { label: 'ChatGPT', value: 61 },
      { label: 'Claude', value: 64 },
    ],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Let's Talk',
    description: 'For global brands needing bespoke integrations, governance, and premium support.',
    tagline: 'Daily AIRO Score refresh, unlimited workspaces & API access.',
    features: [
      'Unlimited workspaces & seats',
      'Daily AIRO Score + alerting',
      'Custom AI integrations & APIs',
      'Dedicated strategist & workshops',
      'Security reviews & SSO readiness',
    ],
    report: [
      { label: 'AIRO Score', value: 88 },
      { label: 'Gemini', value: 90 },
      { label: 'ChatGPT', value: 76 },
      { label: 'Claude', value: 82 },
      { label: 'DeepSeek', value: 74 },
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

  const activePlan = selectedPlan ? plans.find((plan) => plan.name === selectedPlan) : null;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedPlan(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedPlan) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPlan]);

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
              </ul>
            </div>
            <button
              onClick={() => setSelectedPlan(plan.name)}
              className={`mt-10 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                plan.highlight
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:-translate-y-1 hover:bg-primary-dark focus-visible:outline-primary'
                  : 'border border-neutral-300 text-neutral-900 hover:border-neutral-900 focus-visible:outline-neutral-900'
              }`}
            >
              Explore Plans
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activePlan && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-10 relative mx-4"
            >
              <button
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
              <h2 className="text-3xl font-bold mb-2">{activePlan.name} Plan</h2>
              <p className="text-gray-600 mb-6">{activePlan.description}</p>
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h4 className="font-medium mb-2 text-gray-700">AIRO Report Preview</h4>
                <p className="text-sm text-gray-500 mb-4">Sample visibility results and optimization suggestions:</p>
                <div className="grid grid-cols-2 gap-4">
                  {activePlan.report.map((metric) => (
                    <div key={metric.label} className="bg-white rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
                      <div className="text-lg font-semibold text-gray-900">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <Link
                  to={activePlan.name === 'Enterprise' ? '/demo' : '/signup'}
                  className="flex-1 inline-flex items-center justify-center rounded-full bg-primary text-white px-6 py-3 text-sm font-semibold transition hover:bg-primary-dark"
                >
                  {activePlan.name === 'Enterprise' ? 'Talk to Sales' : 'Get Started'}
                </Link>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="px-6 py-3 text-sm font-semibold text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}