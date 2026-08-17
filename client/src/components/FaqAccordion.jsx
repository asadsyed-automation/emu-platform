import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqAccordion = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'Is this an official platform of Emerson University Multan?',
      a: 'No. EMU is an independent student-led initiative currently piloting with one BS(CS) class section at Emerson University Multan. It is not an official platform of EUM, though built to institutional standards to streamline attendance and reporting.',
    },
    {
      q: 'Is my student data and password secure?',
      a: 'Yes. Passwords are hashed using industry-standard bcrypt, sessions use JWT authentication, and every query touching grades or attendance is strictly scoped to your authenticated account ID.',
    },
    {
      q: 'What if a student tries to abuse the attendance dispute feature?',
      a: 'Disputes are strictly protected against abuse. A student can raise at most 3 disputes per course per semester within a 24-hour window. Each dispute requires validation by a 2/3 majority of top-attended peers before reaching the teacher.',
    },
    {
      q: 'Does EMU cost anything for students or teachers?',
      a: 'No, EMU is 100% free for all students and teachers in the pilot class section.',
    },
    {
      q: 'What if our class section is not in the initial pilot?',
      a: 'EMU is currently being tested with BS(CS) 7th semester section at EUM. Following pilot evaluation, expansion to additional class sections will be discussed with the department.',
    },
    {
      q: 'How is EMU different from a WhatsApp group or shared spreadsheet?',
      a: 'WhatsApp groups and spreadsheets lack unalterable audit trails, date-locked timetable verification, automated 2/3 peer dispute voting, and instant 1-click PDF/CSV semester report generation.',
    },
  ];

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;

        return (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '12px',
              overflow: 'hidden',
              boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
            }}
          >
            <button
              onClick={() => toggle(idx)}
              style={{
                width: '100%',
                padding: '18px 22px',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.02rem',
                fontWeight: '600',
                color: isOpen ? 'var(--eum-maroon)' : 'var(--text-dark)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HelpCircle size={18} style={{ color: isOpen ? 'var(--eum-maroon)' : 'var(--text-muted)' }} />
                <span>{faq.q}</span>
              </div>
              <ChevronDown
                size={18}
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  color: 'var(--text-muted)',
                }}
              />
            </button>

            {isOpen && (
              <div
                style={{
                  padding: '0 22px 18px 50px',
                  fontSize: '0.92rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                  borderTop: '1px dashed var(--border-color)',
                  paddingTop: '14px',
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
