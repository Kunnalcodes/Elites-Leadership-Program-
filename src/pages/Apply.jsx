import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';

export function Apply() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    university: '',
    major: '',
    whyThreadElite: '',
    priorExperience: '',
    securityInterest: 'Threat Modeling & Risk Governance',
    weeklyCommitment: '3-5 hours/week',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="w-full min-h-screen bg-[#08070C] text-white pt-28 pb-20">
      <div className="elite-container max-w-3xl px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#15111F] border border-[#38264F] mb-4">
            <Shield size={14} className="text-[#8CCF42]" />
            <span className="font-mono text-xs font-bold text-[#8CCF42] tracking-widest uppercase">
              OFFICIAL CANDIDACY PORTAL
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            THREAD ELITE <span className="text-[#8000FF]">APPLICATION</span>
          </h1>
          <p className="text-sm sm:text-base text-[#C5BED0] font-sans max-w-xl mx-auto">
            Selectivity ensures cohort quality. Tell us about your background, leadership initiative, and security ambitions.
          </p>
        </div>

        {/* Confirmation State */}
        {isSubmitted ? (
          <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-8 sm:p-12 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#8CCF42]/20 border border-[#8CCF42] text-[#8CCF42] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} />
            </div>
            <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-[#8CCF42]/10 border border-[#8CCF42] text-[#8CCF42] uppercase tracking-wider inline-block mb-3">
              APPLICATION RECEIVED
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white mb-4">
              CANDIDACY <span className="text-[#8CCF42]">UNDER REVIEW</span>
            </h2>
            <p className="text-sm text-[#C5BED0] max-w-md mx-auto mb-6 leading-relaxed font-sans">
              Thank you, <strong className="text-white">{formData.fullName}</strong>. Your candidacy has been recorded into the Thread Security Admissions Directorate. A confirmation has been logged for <strong className="text-[#8CCF42]">{formData.email}</strong>.
            </p>

            <div className="p-4 bg-[#15111F] rounded-xl border border-[#292132] max-w-md mx-auto text-left mb-8 font-mono text-xs text-[#C5BED0] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#898293]">APPLICANT:</span>
                <span className="text-white">{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#898293]">INSTITUTION:</span>
                <span className="text-white">{formData.university}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#898293]">FOCUS TRACK:</span>
                <span className="text-[#8CCF42]">{formData.securityInterest}</span>
              </div>
            </div>

            <Button to="/" variant="primary">
              RETURN TO HOMEPAGE
            </Button>
          </div>
        ) : (
          /* Multi-step Application Form */
          <div className="bg-[#100D17] border border-[#38264F] rounded-2xl p-6 sm:p-10 shadow-2xl">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-[#292132] pb-6 mb-8">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#8000FF]" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  STEP 0{currentStep} OF 03
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step === currentStep
                        ? 'w-8 bg-[#8000FF]'
                        : step < currentStep
                        ? 'w-4 bg-[#8CCF42]'
                        : 'w-4 bg-[#292132]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    01. PERSONAL & ACADEMIC INFORMATION
                  </h3>

                  <div>
                    <label className="block font-mono text-xs font-bold text-[#C5BED0] uppercase tracking-wider mb-2">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Mercer"
                      className="w-full h-12 px-4 rounded-lg bg-[#15111F] border border-[#38264F] focus:border-[#8000FF] focus:outline-none text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-[#C5BED0] uppercase tracking-wider mb-2">
                      ACADEMIC EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex.mercer@university.edu"
                      className="w-full h-12 px-4 rounded-lg bg-[#15111F] border border-[#38264F] focus:border-[#8000FF] focus:outline-none text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold text-[#C5BED0] uppercase tracking-wider mb-2">
                        UNIVERSITY / INSTITUTION *
                      </label>
                      <input
                        type="text"
                        name="university"
                        required
                        value={formData.university}
                        onChange={handleChange}
                        placeholder="State University"
                        className="w-full h-12 px-4 rounded-lg bg-[#15111F] border border-[#38264F] focus:border-[#8000FF] focus:outline-none text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs font-bold text-[#C5BED0] uppercase tracking-wider mb-2">
                        MAJOR / FIELD OF STUDY *
                      </label>
                      <input
                        type="text"
                        name="major"
                        required
                        value={formData.major}
                        onChange={handleChange}
                        placeholder="Computer Science"
                        className="w-full h-12 px-4 rounded-lg bg-[#15111F] border border-[#38264F] focus:border-[#8000FF] focus:outline-none text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!formData.fullName || !formData.email || !formData.university}
                      onClick={() => setCurrentStep(2)}
                      className="h-12 px-8 rounded-lg bg-[#8000FF] hover:bg-[#A020F0] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-40"
                    >
                      <span>CONTINUE TO STEP 02</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    02. MOTIVATION & LEADERSHIP
                  </h3>

                  <div>
                    <label className="block font-mono text-xs font-bold text-[#C5BED0] uppercase tracking-wider mb-2">
                      WHY DO YOU WANT TO JOIN THREAD ELITE? *
                    </label>
                    <textarea
                      name="whyThreadElite"
                      rows={4}
                      required
                      value={formData.whyThreadElite}
                      onChange={handleChange}
                      placeholder="Describe your motivation, ethical perspective, and what you hope to contribute to the cohort."
                      className="w-full p-4 rounded-lg bg-[#15111F] border border-[#38264F] focus:border-[#8000FF] focus:outline-none text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-[#C5BED0] uppercase tracking-wider mb-2">
                      PRIOR LEADERSHIP OR TECHNICAL PROJECTS (OPTIONAL)
                    </label>
                    <textarea
                      name="priorExperience"
                      rows={3}
                      value={formData.priorExperience}
                      onChange={handleChange}
                      placeholder="Highlight any student organizations, CTFs, research papers, or community projects."
                      className="w-full p-4 rounded-lg bg-[#15111F] border border-[#38264F] focus:border-[#8000FF] focus:outline-none text-white text-sm"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="h-12 px-6 rounded-lg bg-[#15111F] border border-[#38264F] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1D1729] transition-all"
                    >
                      ← BACK
                    </button>
                    <button
                      type="button"
                      disabled={!formData.whyThreadElite}
                      onClick={() => setCurrentStep(3)}
                      className="h-12 px-8 rounded-lg bg-[#8000FF] hover:bg-[#A020F0] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-40"
                    >
                      <span>CONTINUE TO STEP 03</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    03. INTERESTS & COMMITMENT
                  </h3>

                  <div>
                    <label className="block font-mono text-xs font-bold text-[#C5BED0] uppercase tracking-wider mb-2">
                      PRIMARY SECURITY FOCUS AREA
                    </label>
                    <select
                      name="securityInterest"
                      value={formData.securityInterest}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-lg bg-[#15111F] border border-[#38264F] focus:border-[#8000FF] focus:outline-none text-white text-sm"
                    >
                      <option value="Threat Modeling & Risk Governance">Threat Modeling & Risk Governance</option>
                      <option value="Cloud Security Architecture">Cloud Security Architecture</option>
                      <option value="Vulnerability Research & Disclosure">Vulnerability Research & Disclosure</option>
                      <option value="Executive Security Communication">Executive Security Communication</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold text-[#C5BED0] uppercase tracking-wider mb-2">
                      WEEKLY TIME AVAILABILITY
                    </label>
                    <select
                      name="weeklyCommitment"
                      value={formData.weeklyCommitment}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-lg bg-[#15111F] border border-[#38264F] focus:border-[#8000FF] focus:outline-none text-white text-sm"
                    >
                      <option value="3-5 hours/week">3–5 hours per week (Standard Cohort)</option>
                      <option value="5-8 hours/week">5–8 hours per week (Lead Track)</option>
                    </select>
                  </div>

                  <div className="p-4 bg-[#15111F] rounded-lg border border-[#292132] flex items-start gap-3 text-xs text-[#898293] font-mono">
                    <Lock size={16} className="text-[#8000FF] shrink-0 mt-0.5" />
                    <span>By submitting your application, you affirm that all supplied information is accurate and that you agree to abide by the Thread Elite Standards if selected.</span>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="h-12 px-6 rounded-lg bg-[#15111F] border border-[#38264F] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1D1729] transition-all"
                    >
                      ← BACK
                    </button>
                    <button
                      type="submit"
                      className="h-12 px-8 rounded-lg bg-[#8000FF] hover:bg-[#A020F0] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                    >
                      <span>SUBMIT CANDIDACY</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

export default Apply;
