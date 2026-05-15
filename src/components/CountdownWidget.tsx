import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Exam } from '../store/useAppStore';

interface CountdownWidgetProps {
  exam: Exam;
  isDark: boolean;
}

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({ exam, isDark }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const examDate = new Date(`${exam.date}T${exam.time}:00`);
      const now = new Date();
      const diff = examDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setIsUrgent(diff < 24 * 60 * 60 * 1000);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [exam.date, exam.time]);

  const cardBg = isUrgent
    ? isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
    : isDark ? 'rgba(22,22,24,0.9)' : 'rgba(255,255,255,0.9)';
  const border = isUrgent
    ? isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
    : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const unitBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const units = [
    { value: timeLeft.days, label: 'DAYS' },
    { value: timeLeft.hours, label: 'HRS' },
    { value: timeLeft.minutes, label: 'MIN' },
    { value: timeLeft.seconds, label: 'SEC' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: '20px',
        borderRadius: 20,
        background: cardBg,
        border: `1px solid ${border}`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        marginBottom: 12,
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.04)',
      }}
    >
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: textSecondary, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>
            {isUrgent ? '⚡ EXAM TODAY' : '⏳ NEXT EXAM'}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: textPrimary, letterSpacing: -0.4 }}>
            {exam.subject}
          </div>
          <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
            {new Date(exam.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · {exam.time}
          </div>
        </div>
        <div style={{
          padding: '6px 12px',
          borderRadius: 10,
          background: unitBg,
          fontSize: 12,
          fontWeight: 600,
          color: textSecondary,
          textTransform: 'capitalize',
        }}>
          {exam.place}
        </div>
      </div>

      {/* Countdown units */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {units.map((unit, i) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            style={{
              padding: '12px 8px',
              borderRadius: 12,
              background: unitBg,
              textAlign: 'center',
            }}
          >
            <motion.div
              key={unit.value}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: textPrimary,
                letterSpacing: -1,
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </motion.div>
            <div style={{
              fontSize: 9,
              color: textSecondary,
              fontWeight: 600,
              letterSpacing: 0.8,
              marginTop: 4,
            }}>
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chapters preview */}
      {exam.chapters.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}>
          <div style={{ fontSize: 11, color: textSecondary, fontWeight: 600, letterSpacing: 0.4, marginBottom: 8 }}>
            CHAPTERS TO COVER
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {exam.chapters.slice(0, 2).map((ch, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: unitBg,
                  color: textSecondary,
                  border: `1px solid ${border}`,
                }}
              >
                {ch.length > 22 ? ch.substring(0, 22) + '...' : ch}
              </span>
            ))}
            {exam.chapters.length > 2 && (
              <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: unitBg, color: textSecondary }}>
                +{exam.chapters.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
