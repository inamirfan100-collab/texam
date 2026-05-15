import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, BookOpen, AlertCircle, ChevronRight } from 'lucide-react';
import { Exam, Priority } from '../store/useAppStore';

interface ExamCardProps {
  exam: Exam;
  isDark: boolean;
  onPress?: () => void;
  compact?: boolean;
}

const getPriorityConfig = (priority: Priority, isDark: boolean) => {
  const configs = {
    critical: {
      label: 'Critical',
      bg: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.85)',
      color: isDark ? '#ffffff' : '#ffffff',
      dot: isDark ? '#ffffff' : '#ffffff',
    },
    high: {
      label: 'High',
      bg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.65)',
      color: isDark ? '#ffffff' : '#ffffff',
      dot: isDark ? '#cccccc' : '#dddddd',
    },
    medium: {
      label: 'Medium',
      bg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
      color: isDark ? '#aaaaaa' : '#555555',
      dot: isDark ? '#888888' : '#999999',
    },
    low: {
      label: 'Low',
      bg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
      color: isDark ? '#666666' : '#aaaaaa',
      dot: isDark ? '#555555' : '#cccccc',
    },
  };
  return configs[priority];
};

const getPlaceLabel = (place: Exam['place']) => {
  const labels = { school: 'School', tuition: 'Tuition', coaching: 'Coaching', practice: 'Practice' };
  return labels[place];
};

const useCountdown = (dateStr: string, timeStr: string) => {
  const [countdown, setCountdown] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const examDate = new Date(`${dateStr}T${timeStr}:00`);
      const now = new Date();
      const diff = examDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('Started');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setIsUrgent(diff < 24 * 60 * 60 * 1000);

      if (days > 0) setCountdown(`${days}d ${hours}h`);
      else if (hours > 0) setCountdown(`${hours}h ${minutes}m`);
      else setCountdown(`${minutes}m`);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [dateStr, timeStr]);

  return { countdown, isUrgent };
};

export const ExamCard: React.FC<ExamCardProps> = ({ exam, isDark, onPress, compact }) => {
  const { countdown, isUrgent } = useCountdown(exam.date, exam.time);
  const priorityConfig = getPriorityConfig(exam.priority, isDark);

  const cardBg = isDark ? 'rgba(22,22,24,0.9)' : 'rgba(255,255,255,0.9)';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const metaBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const divider = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  const dateObj = new Date(exam.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

  if (compact) {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onPress}
        style={{
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: 16,
          padding: '16px',
          cursor: 'pointer',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: isUrgent ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : metaBg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, lineHeight: 1 }}>{dateObj.getDate()}</div>
          <div style={{ fontSize: 10, color: textSecondary, marginTop: 1 }}>{dayOfWeek}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: textPrimary }}>{exam.subject}</div>
          <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
            {getPlaceLabel(exam.place)} · {exam.time}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: isUrgent ? (isDark ? '#ffffff' : '#000000') : textSecondary,
          }}>
            {countdown}
          </div>
          <div style={{
            fontSize: 10,
            color: textSecondary,
            marginTop: 2,
          }}>
            {exam.priority}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={onPress}
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        marginBottom: 12,
      }}
    >
      {/* Top section */}
      <div style={{ padding: '18px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: 6,
                background: priorityConfig.bg,
                color: priorityConfig.color,
                letterSpacing: 0.3,
                textTransform: 'uppercase',
              }}>
                {priorityConfig.label}
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: textPrimary, letterSpacing: -0.4 }}>
              {exam.subject}
            </h3>
          </div>

          {/* Countdown circle */}
          <div style={{
            textAlign: 'center',
            minWidth: 64,
          }}>
            <div style={{
              fontSize: isUrgent ? 14 : 16,
              fontWeight: 700,
              color: isUrgent ? (isDark ? '#ffffff' : '#000000') : textPrimary,
              lineHeight: 1,
            }}>
              {countdown}
            </div>
            <div style={{ fontSize: 10, color: textSecondary, marginTop: 3, fontWeight: 400 }}>remaining</div>
          </div>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 10px',
            borderRadius: 8,
            background: metaBg,
          }}>
            <MapPin size={11} color={textSecondary} strokeWidth={1.5} />
            <span style={{ fontSize: 12, color: textSecondary }}>
              {getPlaceLabel(exam.place)}
              {exam.teacherName ? ` · ${exam.teacherName}` : ''}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 10px',
            borderRadius: 8,
            background: metaBg,
          }}>
            <Clock size={11} color={textSecondary} strokeWidth={1.5} />
            <span style={{ fontSize: 12, color: textSecondary }}>{formattedDate} · {exam.time}</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 10px',
            borderRadius: 8,
            background: metaBg,
          }}>
            <AlertCircle size={11} color={textSecondary} strokeWidth={1.5} />
            <span style={{ fontSize: 12, color: textSecondary }}>{exam.fullMarks} marks</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: divider, margin: '0 20px' }} />

      {/* Chapters section */}
      <div style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <BookOpen size={12} color={textSecondary} strokeWidth={1.5} />
          <span style={{ fontSize: 11, color: textSecondary, fontWeight: 500, letterSpacing: 0.3 }}>
            CHAPTERS · {exam.chapters.length}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {exam.chapters.slice(0, 3).map((ch, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: 6,
                background: metaBg,
                color: textSecondary,
                border: `1px solid ${border}`,
              }}
            >
              {ch.length > 20 ? ch.substring(0, 20) + '...' : ch}
            </span>
          ))}
          {exam.chapters.length > 3 && (
            <span style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 6,
              background: metaBg,
              color: textSecondary,
            }}>
              +{exam.chapters.length - 3} more
            </span>
          )}
        </div>

        {/* Question patterns */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {exam.questionPatterns.map((qp) => (
            <span
              key={qp}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 5,
                border: `1px solid ${border}`,
                color: textPrimary,
              }}
            >
              {qp}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 20px',
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 12, color: textSecondary }}>
          {dayOfWeek}, {formattedDate} at {exam.time}
        </span>
        <ChevronRight size={14} color={textSecondary} strokeWidth={1.5} />
      </div>
    </motion.div>
  );
};
