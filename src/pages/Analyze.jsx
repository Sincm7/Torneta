import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AnalyzePage() {
  const [companyName, setCompanyName] = useState('');
  const [companyDomain, setCompanyDomain] = useState('');
  const [email, setEmail] = useState('');
  const [prompts, setPrompts] = useState(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!showSuccessModal) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showSuccessModal]);

  const handleAddPrompt = () => {
    if (prompts.length >= 12) return;
    setPrompts((prevPrompts) => [...prevPrompts, '']);
  };

  const handlePromptChange = (index, value) => {
    setPrompts((prevPrompts) => {
      const next = [...prevPrompts];
      next[index] = value;
      return next;
    });
  };

  const sendEmailNotification = async (data) => {
    try {
      const emailPayload = {
        to: data.email, // Kullanıcının girdiği business email
        subject: `Your AIRO Analysis Report - ${data.companyName}`,
        companyName: data.companyName,
        companyDomain: data.companyDomain,
        promptsCount: data.promptsCount,
        analysisData: data.analysisData,
      };

      // Send email via webhook or email service
      const emailResponse = await fetch('https://sincm.app.n8n.cloud/webhook/email-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(emailPayload),
      });

      if (!emailResponse.ok) {
        console.warn('Email notification failed, but analysis was successful');
      } else {
        console.log('Email sent successfully to:', data.email);
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't throw - email failure shouldn't block the analysis success
    }
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();

    const trimmedName = companyName.trim();
    const trimmedDomain = companyDomain.trim();
    const trimmedEmail = email.trim();
    const promptsArray = prompts.map((prompt) => prompt.trim()).filter(Boolean);

    if (!trimmedEmail || !/.+@.+\..+/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid business email.');
      return;
    }

    if (!trimmedName || !trimmedDomain) {
      setErrorMessage('Company name and domain are required.');
      return;
    }

    if (promptsArray.length < 3 || promptsArray.length > 12) {
      setErrorMessage('Please provide between 3 and 12 prompts.');
      return;
    }

    const payload = {
      companyName: trimmedName,
      companyDomain: trimmedDomain,
      email: trimmedEmail,
      prompts: promptsArray,
    };

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setAnalysis(null);

      const response = await fetch('https://sincm.app.n8n.cloud/webhook-test/form-submission-secure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (jsonError) {
        // Response might not be JSON which is acceptable for this placeholder endpoint
      }

      console.log('Analyze response:', data ?? response);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText || 'Request failed'}`);
      }

      // Normalize response: some flows return an array with a single result object
      const normalized = Array.isArray(data) ? data[0] : data;

      if (
        normalized &&
        (
          normalized.pointAverage !== undefined ||
          normalized.pointDS !== undefined ||
          normalized.pointGM !== undefined ||
          normalized.pointGPT !== undefined
        )
      ) {
        setAnalysis(normalized);
      } else {
        setAnalysis(null);
      }

      // Send email notification
      await sendEmailNotification({
        companyName: trimmedName,
        companyDomain: trimmedDomain,
        email: trimmedEmail,
        promptsCount: promptsArray.length,
        analysisData: normalized,
      });

      setCompanyName('');
      setCompanyDomain('');
      setEmail('');
      setPrompts(['', '', '']);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Analyze error:', error);

      // Provide more specific error messages based on the error type
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setErrorMessage('Network error: Unable to connect to the analysis service. This might be due to CORS restrictions or the service being unavailable. Please check your internet connection and try again.');
      } else if (error.message.includes('404')) {
        setErrorMessage('Service not found: The analysis endpoint is not available. Please contact support.');
      } else if (error.message.includes('CORS')) {
        setErrorMessage('CORS error: The analysis service is not configured to accept requests from this domain. Please contact support.');
      } else {
        setErrorMessage(`Analysis failed: ${error.message || 'Something went wrong while submitting your analysis request. Please try again.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 bg-white/80 p-10 shadow-sm">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Analyze
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
              AI Visibility Analysis
            </h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              Enter your company info and target prompts to prepare for your AI visibility review.
            </p>
          </div>

          <form className="mt-12 space-y-6" onSubmit={handleAnalyze} noValidate>
            <div className="space-y-2">
              <label htmlFor="businessEmail" className="text-sm font-medium text-neutral-700">
                Business Email
              </label>
              <input
                id="businessEmail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium text-neutral-700">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Acme Inc."
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="companyDomain" className="text-sm font-medium text-neutral-700">
                Company Domain
              </label>
              <input
                id="companyDomain"
                type="text"
                value={companyDomain}
                onChange={(event) => setCompanyDomain(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="acme.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">Prompts</label>
                <span className="text-xs text-neutral-500">3-12 prompts</span>
              </div>
              <div className="space-y-4">
                {prompts.map((prompt, index) => (
                  <input
                    key={`prompt-${index}`}
                    type="text"
                    value={prompt}
                    onChange={(event) => handlePromptChange(index, event.target.value)}
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter a target prompt…"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddPrompt}
                className="inline-flex items-center text-sm font-semibold text-primary transition disabled:cursor-not-allowed disabled:opacity-40"
                disabled={prompts.length >= 12}
              >
                + Add prompt
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Running Analysis...' : 'Get Report'}
            </button>
          </form>

          {analysis && (
            <div className="mt-12 space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-neutral-900">Analysis Results</h2>
                <p className="mt-2 text-sm text-neutral-600">Your AI visibility scores and competitor landscape</p>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white/70 p-8 shadow-sm">
                <div className="text-center">
                  <div className="text-xs font-medium uppercase tracking-widest text-neutral-500">Average Score</div>
                  <div className="mt-2 text-5xl font-bold text-neutral-900">{Number(analysis.pointAverage ?? 0).toFixed(2)}</div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-neutral-200 p-4 text-center">
                    <div className="text-xs font-medium uppercase tracking-widest text-neutral-500">DS Score</div>
                    <div className="mt-1 text-2xl font-semibold text-neutral-900">{Number(analysis.pointDS ?? 0).toFixed(2)}</div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 p-4 text-center">
                    <div className="text-xs font-medium uppercase tracking-widest text-neutral-500">GM Score</div>
                    <div className="mt-1 text-2xl font-semibold text-neutral-900">{Number(analysis.pointGM ?? 0).toFixed(2)}</div>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 p-4 text-center">
                    <div className="text-xs font-medium uppercase tracking-widest text-neutral-500">GPT Score</div>
                    <div className="mt-1 text-2xl font-semibold text-neutral-900">{Number(analysis.pointGPT ?? 0).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm">
                <div className="text-sm font-semibold text-neutral-900 mb-4">Competitors</div>
                <div className="space-y-3">
                  {(() => {
                    // Tüm competitor listelerini birleştir
                    const allCompetitors = [
                      ...(analysis.competitor_listDP ?? []),
                      ...(analysis.competitor_listGM ?? []),
                      ...(analysis.competitor_listGPT ?? [])
                    ];

                    // Her şirket için en yüksek score'u bul
                    const competitorMap = {};
                    allCompetitors.forEach(item => {
                      if (typeof item === 'object' && item.company_name) {
                        const name = item.company_name;
                        const score = item.company_score || 0;
                        
                        if (!competitorMap[name] || competitorMap[name].score < score) {
                          competitorMap[name] = {
                            name: name,
                            domain: item.company_domain,
                            score: score
                          };
                        }
                      }
                    });

                    // Object'i array'e çevir ve score'a göre sırala
                    const sortedCompetitors = Object.values(competitorMap)
                      .sort((a, b) => b.score - a.score);

                    return sortedCompetitors.map((competitor, idx) => (
                      <div key={`competitor-${idx}`} className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">{competitor.name}</div>
                          <div className="text-xs text-neutral-500">{competitor.domain}</div>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          <span className="text-xs text-neutral-500">Mentions</span>
                          <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {competitor.score}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          >
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center w-full max-w-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <span className="text-3xl text-green-500">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800">Analysis Submitted</h3>
              <p className="mt-2 text-sm text-neutral-500">We’ll reach out to you via email soon.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
