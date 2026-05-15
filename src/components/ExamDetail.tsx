import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Clock, BookOpen, AlertTriangle, Check, Edit3 } from 'lucide-react';
import { Exam, useAppStore } from '../store/useAppStore';

interface ExamDetailProps {
  exam: Exam;
  onClose: () => void;
  isDark: boolean;
}

export const ExamDetail: React.FC<ExamDetailProps> = ({ exam, onClose, isDark }) => {
  const { updateExam, deleteExam } = useAppStore();
  const [showMarkEntry, setShowMarkEntry] = useState(false);
  const [obtainedMarks, setObtainedMarks] = useState(exam.obtainedMarks?.toString() || '');
  const [notes, setNotes] = useState(exam.notes || '');

  const bg = isDark ? '#0d0d0d' : '#ffffff';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const metaBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const btnBg = isDark ? '#ffffff' : '#000000';
  const btnText = isDark ? '#000000' : '#ffffff';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const divider = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const dateObj = new Date(exam.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const priorityColors: Record<string, string> = {
    critical: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.85)',
    high: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.65)',
    medium: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    low: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
  };

  const priorityTextColors: Record<string, string> = {
    critical: '#ffffff',
    high: '#ffffff',
    medium: isDark ? '#aaaaaa' : '#555555',
    low: isDark ? '#666666' : '#aaaaaa',
  };

  const handleMarkEntry = () => {
    const marks = parseInt(obtainedMarks);
    if (!isNaN(marks)) {
      updateExam(exam.id, {
        obtainedMarks: marks,
        status: 'completed',
        notes: notes || undefined,
      });
      setShowMarkEntry(false);
      onClose();
    }
  };

  const getPlaceLabel = (place: Exam['place']) => {
    return { school: 'School', tuition: 'Tuition', coaching: 'Coaching', practice: 'Practice' }[place];
  };

  const percentage = exam.obtainedMarks !== undefined
    ? Math.round((exam.obtainedMarks / exam.fullMarks) * 100)
    : null;

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: bg,
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '52px 24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: metaBg,
            border: `1px solid ${border}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} color={textPrimary} />
        </motion.button>

        <div style={{ display: 'flex', gap: 8 }}>
          {exam.status === 'upcoming' && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMarkEntry(true)}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                background: metaBg,
                border: `1px solid ${border}`,
                color: textPrimary,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Edit3 size={12} /> Mark Result
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { deleteExam(exam.id); onClose(); }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'transparent',
              border: `1px solid ${border}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            🗑️
          </motion.button>
        </div>
      </div>

      <div className="page-scroll" style={{ flex: 1, padding: '0 24px' }}>
        {/* Subject & Priority */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex',
            padding: '4px 12px',
            borderRadius: 8,
            background: priorityColors[exam.priority],
            marginBottom: 10,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: priorityTextColors[exam.priority], letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {exam.priority}
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: textPrimary, letterSpacing: -1, lineHeight: 1.1 }}>
            {exam.subject}
          </h1>

          {exam.status === 'completed' && percentage !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                marginTop: 16,
                padding: '16px 20px',
                borderRadius: 16,
                background: metaBg,
                border: `1px solid ${border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: textSecondary, marginBottom: 4 }}>Score</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: textPrimary }}>
                  {exam.obtainedMarks}/{exam.fullMarks}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: textSecondary, marginBottom: 4 }}>Percentage</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: textPrimary }}>{percentage}%</div>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: percentage >= 80 ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)') : metaBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {percentage >= 80 ? '🏆' : percentage >= 60 ? '✅' : '📊'}
              </div>
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: divider, marginBottom: 20 }} />

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: metaBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Clock size={16} color={textSecondary} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}>{formattedDate}</div>
              <div style={{ fontSize: 12, color: textSecondary }}>{exam.time}{exam.duration ? ` · ${exam.duration} minutes` : ''}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: metaBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <MapPin size={16} color={textSecondary} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}>{getPlaceLabel(exam.place)}</div>
              {exam.teacherName && <div style={{ fontSize: 12, color: textSecondary }}>{exam.teacherName}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: metaBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <AlertTriangle size={16} color={textSecondary} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary }}>
                {exam.fullMarks} marks{exam.passMarks ? ` · Pass: ${exam.passMarks}` : ''}
              </div>
              <div style={{ fontSize: 12, color: textSecondary }}>Question types: {exam.questionPatterns.join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BookOpen size={14} color={textSecondary} strokeWidth={1.5} />
            <span style={{ fontSize: 12, color: textSecondary, fontWeight: 600, letterSpacing: 0.5 }}>
              CHAPTERS ({exam.chapters.length})
            </span>
          </div>
          {exam.chapters.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {exam.chapters.map((ch, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: metaBg,
                    border: `1px solid ${border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Check size={12} color={textSecondary} strokeWidth={1.5} />
                  <span style={{ fontSize: 13, color: textPrimary }}>{ch}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: textSecondary }}>No chapters specified</div>
          )}
        </div>

        {/* Reminders */}
        {exam.reminders.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: textSecondary, fontWeight: 600, letterSpacing: 0.5, marginBottom: 10 }}>
              REMINDERS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {exam.reminders.map((r, i) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: metaBg,
                    border: `1px solid ${border}`,
                    fontSize: 12,
                    color: textSecondary,
                  }}
                >
                  🔔 {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {exam.notes && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: textSecondary, fontWeight: 600, letterSpacing: 0.5, marginBottom: 10 }}>NOTES</div>
            <div style={{
              padding: '14px',
              borderRadius: 12,
              background: metaBg,
              border: `1px solid ${border}`,
              fontSize: 13,
              color: textPrimary,
              lineHeight: 1.6,
            }}>
              {exam.notes}
            </div>
          </div>
        )}

        {/* Mark Entry Form */}
        {showMarkEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: 24,
              padding: '20px',
              borderRadius: 20,
              background: metaBg,
              border: `1px solid ${border}`,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: textPrimary, marginBottom: 16 }}>
              Enter Exam Result
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8, fontWeight: 500 }}>
                OBTAINED MARKS (out of {exam.fullMarks})
              </div>
              <input
                type="number"
                value={obtainedMarks}
                onChange={(e) => setObtainedMarks(e.target.value)}
                placeholder="Enter marks..."
                max={exam.fullMarks}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 14,
                  border: `1.5px solid ${obtainedMarks ? (isDark ? '#ffffff' : '#000000') : border}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'center',
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8, fontWeight: 500 }}>NOTES (optional)</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it go? Any thoughts..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                  resize: 'none',
                  lineHeight: 1.5,
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowMarkEntry(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 12,
                  background: 'transparent',
                  border: `1px solid ${border}`,
                  color: textSecondary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleMarkEntry}
                disabled={!obtainedMarks}
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: 12,
                  background: obtainedMarks ? btnBg : metaBg,
                  color: obtainedMarks ? btnText : textSecondary,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: obtainedMarks ? 'pointer' : 'default',
                }}
              >
                Save Result ✓
              </motion.button>
            </div>
          </motion.div>
        )}

        <div style={{ height: 40 }} />
      </div>
    </motion.div>
  );
};
