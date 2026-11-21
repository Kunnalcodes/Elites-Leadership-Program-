import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is Thread Elite?',
      a: 'Thread Elite is a premier one-year, invitation-based student leadership and professional development program operated by Thread Security. It combines cybersecurity technical execution, threat analysis, ethical responsibility, and leadership training.',
    },
    {
      q: 'Who can become a Thread Elite member?',
      a: 'The program is open to ambitious university students, early-stage researchers, and emerging cybersecurity practitioners who demonstrate high initiative, technical curiosity, accountability, and leadership potential.',
    },
    {
      q: 'How long does the program run?',
      a: 'Thread Elite operates as an intensive, continuous 12-month (one-year) lifecycle, structured across progressive promotion milestones from orientation through signature capstone defense.',
    },
    {
      q: 'What does the one-year journey involve?',
      a: 'Participants engage in expert workshops, hands-on security challenges, collaborative research projects, 1:1 mentorship dialogue, rubric-based assessments, and peer-led community initiatives.',
    },
    {
      q: 'How do promotion levels work?',
      a: 'Elites advance across five configurable tiers: Foundation, Catalyst, Pioneer, Apex, and Legacy. Promotion is merit-based, transactional, and validated by completed deliverables and rubric criteria without erasing previous tier history.',
    },
    {
      q: 'How are tasks assigned?',
      a: 'Task Masters configure assignments across 23 formats (written reports, code repositories, threat models, assessments, presentations) targeted by cohort, promotion level, or individual focus.',
    },
    {
      q: 'How are submissions evaluated?',
      a: 'All work is reviewed against standardized rubrics evaluating technical accuracy, research depth, execution, and presentation clarity. Evaluators provide constructive criterion-level notes before finalizing grades.',
    },
    {
      q: 'How do XP and leaderboard rankings work?',
      a: 'Evaluated work generates immutable double-entry XP ledger transactions. Rankings are recalculated centrally using validated scores and completion metrics, highlighting the top three Champions on published snapshots.',
    },
    {
      q: 'Will Elites receive mentor guidance?',
      a: 'Yes. Each Elite is paired with an assigned industry mentor from Thread Security. Participants can initiate direct 1:1 inquiry threads, request review guidance, and track mentoring sessions.',
    },
    {
      q: 'How can existing Elites access their dashboard?',
      a: 'Authorized participants can click "Elite Login" in the navigation bar or visit /login, sign in with their unique Elite ID and password, and complete the 8-character single-use OTP verification to enter their tier workspace.',
    },
  ];

  return (
    <section id="faq" className="w-full bg-[#08070C] section-vertical-space border-t border-[#1D1729]">
      <div className="elite-container max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-mono tracking-widest text-[#8000FF] uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions // 10</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-4">
            EVERYTHING YOU NEED TO KNOW.
          </h2>
          <p className="text-base text-[#C5BED0]">
            Transparent answers regarding eligibility, program structure, evaluation, and progression.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#15111F] border border-[#292132] hover:border-[#38264F] rounded-[18px] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base sm:text-lg font-bold text-white">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#100D17] border border-[#38264F] flex items-center justify-center text-[#BD7AFF] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#1D1729] border-[#8000FF]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#C5BED0] leading-relaxed border-t border-[#1D1729]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
