import { useEffect, useRef, useState } from 'react';
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
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);
  const [submittedMeta, setSubmittedMeta] = useState({ name: '', domain: '' });
  const [showDownloadToast, setShowDownloadToast] = useState(false);

  useEffect(() => {
    if (!showSuccessModal) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showSuccessModal]);

  // Auto-hide download toast
  useEffect(() => {
    if (!showDownloadToast) return undefined;
    const t = setTimeout(() => setShowDownloadToast(false), 2000);
    return () => clearTimeout(t);
  }, [showDownloadToast]);

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
        console.log('Setting analysis with checklist:', normalized.checklist ? 'Yes' : 'No');
        console.log('Full normalized data:', normalized);
        setAnalysis(normalized);
      } else {
        setAnalysis(null);
      }

      // Remember submitted meta for PDF naming/header
      setSubmittedMeta({ name: trimmedName, domain: trimmedDomain });

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

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      // Lazy-load jsPDF
      const [{ jsPDF }] = await Promise.all([
        import('jspdf')
      ]);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 16; // daha ferah kenar boşluğu

      // Soft blur-like pale blue background
      pdf.setFillColor('#F5F9FF');
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setFillColor('#EAF2FF');
      pdf.circle(pageWidth - 20, 18, 22, 'F');
      pdf.setFillColor('#E3EEFF');
      pdf.circle(28, pageHeight - 22, 26, 'F');

      // Header
      pdf.setTextColor('#1d4ed8');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('AIRO Report', margin, 20);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      const brandName = submittedMeta.name || companyName || 'Brand';
      const domain = submittedMeta.domain || analysis?.companyDomain || '';
      const dateStr = new Date().toLocaleString();
      pdf.setTextColor('#111111');
      pdf.text(`${brandName}`, margin, 28);
      pdf.setTextColor('#6b7280');
      pdf.text(`${domain || ''}`, margin, 34);
      pdf.setTextColor('#111111');
      pdf.text(`${dateStr}`, margin, 40);

      // Divider
      pdf.setDrawColor(220);
      pdf.line(margin, 44, pageWidth - margin, 44);

      let y = 54;
      const lineGap = 10;
      const cardGap = 8;

      const ensureY = (advance) => {
        if (y + advance > pageHeight - 16) {
          pdf.addPage();
          y = margin + 8;
        }
      };

      // Scores Section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#1d4ed8');
      pdf.text('AI Visibility Scores', margin, y);
      y += 6;
      pdf.setTextColor('#111111');
      pdf.setFont('helvetica', 'normal');
      // Draw score chips (card-like)
      const chips = [
        { label: 'AIRO', value: Number(analysis.pointAverage ?? 0).toFixed(2) },
        { label: 'ChatGPT', value: Number(analysis.pointGPT ?? 0).toFixed(2) },
        { label: 'Gemini', value: Number(analysis.pointGM ?? 0).toFixed(2) },
        { label: 'DeepSeek', value: Number(analysis.pointDS ?? 0).toFixed(2) },
      ];
      let x = margin;
      const chipH = 12;
      const chipPadX = 4;
      const chipPadY = 3;
      const gapX = 6;
      chips.forEach((c) => {
        const txt = `${c.label}: ${c.value}`;
        const w = pdf.getTextWidth(txt) + chipPadX * 2;
        ensureY(chipH + cardGap);
        if (x + w > pageWidth - margin) {
          x = margin; y += chipH + 6;
        }
        pdf.setDrawColor(220);
        pdf.roundedRect(x, y, w, chipH, 2, 2, 'S');
        pdf.setTextColor('#111111');
        pdf.text(txt, x + chipPadX, y + chipH - chipPadY - 1);
        x += w + gapX;
      });
      y += chipH + 10;
      x = margin;

      // Divider
      pdf.setDrawColor(235);
      pdf.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 10;

      // Competitors: always include (even if collapsed in UI)
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor('#1d4ed8');
      pdf.text('Competitors (Mentions)', margin, y);
      y += 6;
      pdf.setTextColor('#111111');
      pdf.setFont('helvetica', 'normal');

      const allCompetitors = [
        ...(analysis.competitor_listDP ?? []),
        ...(analysis.competitor_listGM ?? []),
        ...(analysis.competitor_listGPT ?? [])
      ];
      const compMap = {};
      allCompetitors.forEach((c) => {
        if (c && c.company_name) {
          const nm = c.company_name;
          const sc = c.company_score || 0;
          if (!compMap[nm] || compMap[nm].score < sc) {
            compMap[nm] = { name: nm, domain: c.company_domain, score: sc };
          }
        }
      });
      const compArr = Object.values(compMap).sort((a, b) => b.score - a.score);
      if (compArr.length === 0) {
        pdf.text('No competitor data available.', margin, y);
        y += lineGap;
      } else {
        compArr.forEach((c) => {
          const line = `${c.name}  (${c.domain || 'n/a'})  • Mentions: ${c.score}`;
          // New page if needed
          if (y > pageHeight - 20) {
            pdf.addPage();
            y = margin;
          }
          // Card-like row
          const rowH = 12;
          const w = pageWidth - margin * 2;
          pdf.setDrawColor(220);
          pdf.roundedRect(margin, y - (rowH - 2), w, rowH, 2, 2, 'S');
          pdf.text(line, margin + 5, y);
          y += rowH + 2;
        });
      }

      // Divider
      pdf.setDrawColor(235);
      pdf.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 10;

      // Checklist (if exists)
      if (Array.isArray(analysis.checklist) && analysis.checklist.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor('#1d4ed8');
        pdf.text('Optimization Checklist', margin, y);
        y += 6;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor('#111111');

        analysis.checklist.forEach((item) => {
          const weightStr = Number(item.weight).toFixed(2);
          const line = `${item.name}  (Weight: ${weightStr})`;
          if (y > pageHeight - 20) {
            pdf.addPage();
            y = margin;
          }
          // Card row with colored dot
          const rowH = 12;
          const w = pageWidth - margin * 2;
          pdf.setDrawColor(220);
          pdf.roundedRect(margin, y - (rowH - 2), w, rowH, 2, 2, 'S');
          // status dot
          if (item.score > 0) pdf.setFillColor('#22c55e'); else pdf.setFillColor('#ef4444');
          pdf.circle(margin + 5, y - 3, 2.2, 'F');
          pdf.setTextColor('#111111');
          pdf.text(line, margin + 10, y);
          y += rowH + 2;
        });
      }

      // Footer branding
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor('#1d4ed8');
      pdf.text('Generated via Torneta AIRO Platform', margin, pageHeight - 8);

      const safeName = (submittedMeta.name || companyName || 'Brand').replace(/[^a-z0-9 _-]/gi, '_');
      pdf.save(`${safeName} AIRO Report.pdf`);

      setShowDownloadToast(true);
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setIsExporting(false);
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
            <div ref={reportRef} className="mt-12 space-y-8 relative">
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

              <div className="grid grid-cols-1 gap-6">
                {/* Competitors - collapsible */}
                <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setShowCompetitors((v) => !v)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div className="text-sm font-semibold text-neutral-900">Competitors</div>
                    <span className="text-neutral-500">{showCompetitors ? '−' : '+'}</span>
                  </button>
                  {showCompetitors && (
                    <div className="mt-4 space-y-3">
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
                  )}
                </div>

                {/* Checklist Section - collapsible */}
                {analysis?.checklist && Array.isArray(analysis.checklist) && analysis.checklist.length > 0 && (
                  <div className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setShowChecklist((v) => !v)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div className="text-sm font-semibold text-neutral-900">SEO Optimization Checklist</div>
                      <span className="text-neutral-500">{showChecklist ? '−' : '+'}</span>
                    </button>
                    {showChecklist && (
                      <div className="mt-4">
                      {(() => {
                      // Checklist'i kategorilere göre grupla
                      const categorizedChecklist = {};
                      analysis.checklist.forEach(item => {
                        if (!categorizedChecklist[item.category]) {
                          categorizedChecklist[item.category] = [];
                        }
                        categorizedChecklist[item.category].push(item);
                      });

                      return Object.entries(categorizedChecklist).map(([category, items]) => (
                        <div key={category} className="mb-6 last:mb-0">
                          <h4 className="text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wide">
                            {category}
                          </h4>
                          <div className="space-y-2">
                            {items.map((item, idx) => (
                              <div 
                                key={`${category}-${idx}`}
                                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200"
                              >
                                {/* Status Icon */}
                                <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full ${
                                  item.score > 0 
                                    ? 'bg-green-500' 
                                    : 'bg-red-500'
                                }`}>
                                  {item.score > 0 ? (
                                    <span className="text-white text-sm font-bold">✓</span>
                                  ) : (
                                    <span className="text-white text-sm font-bold">✕</span>
                                  )}
                                </div>

                                {/* Item Name */}
                                <div className="flex-1">
                                  <span className={`text-sm ${
                                    item.score > 0 ? 'text-neutral-900' : 'text-neutral-600'
                                  }`}>
                                    {item.name}
                                  </span>
                                </div>

                                {/* Score Badge */}
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-neutral-500">Weight:</span>
                                  <span className="text-xs font-medium text-neutral-700">
                                    {Number(item.weight).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                      })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Floating Download Button */}
              <div className="sticky bottom-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
                >
                  <span className="inline-block">{isExporting ? 'Preparing…' : 'Download Report (PDF)'} </span>
                </button>
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

      {/* Download toast */}
      <AnimatePresence>
        {showDownloadToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            ✅ Report successfully downloaded
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
