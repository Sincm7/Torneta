import { useState } from 'react';

export default function AnalyzePage() {
  const [companyName, setCompanyName] = useState('');
  const [companyDomain, setCompanyDomain] = useState('');
  const [promptsInput, setPromptsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    const trimmedName = companyName.trim();
    const trimmedDomain = companyDomain.trim();
    const promptsArray = promptsInput
      .split(',')
      .map((prompt) => prompt.trim())
      .filter(Boolean);

    if (!trimmedName || !trimmedDomain || promptsArray.length === 0) {
      setErrorMessage('All fields are required.');
      setSuccessMessage('');
      return;
    }

    if (promptsArray.length < 3 || promptsArray.length > 12) {
      setErrorMessage('Please provide between 3 and 12 prompts separated by commas.');
      setSuccessMessage('');
      return;
    }

    const payload = {
      companyName: trimmedName,
      companyDomain: trimmedDomain,
      prompts: promptsArray,
    };

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');
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
        setSuccessMessage('Analysis report received.');
      } else {
        setSuccessMessage('Analysis request submitted.');
      }
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
                <label htmlFor="prompts" className="text-sm font-medium text-neutral-700">
                  Prompts
                </label>
                <span className="text-xs text-neutral-500">3-12 prompts, separated by commas</span>
              </div>
              <textarea
                id="prompts"
                value={promptsInput}
                onChange={(event) => setPromptsInput(event.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="What are the best project management tools?, How do I choose an AI visibility partner?, ..."
                required
              />
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Running Analysis...' : 'Run Analysis'}
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

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm">
                  <div className="text-sm font-semibold text-neutral-900">Competitors (DP)</div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-700">
                    {(analysis.competitor_listDP ?? []).map((item, idx) => (
                      <li key={`dp-${idx}`}>{String(item)}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm">
                  <div className="text-sm font-semibold text-neutral-900">Competitors (GM)</div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-700">
                    {(analysis.competitor_listGM ?? []).map((item, idx) => (
                      <li key={`gm-${idx}`}>{String(item)}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm">
                  <div className="text-sm font-semibold text-neutral-900">Competitors (GPT)</div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-700">
                    {(analysis.competitor_listGPT ?? []).map((item, idx) => (
                      <li key={`gpt-${idx}`}>{String(item)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
