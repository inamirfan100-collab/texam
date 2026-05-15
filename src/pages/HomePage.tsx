import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Calendar, TrendingUp, AlertTriangle, CheckCircle, Star, Plus, Bell, ChevronRight
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { StatCard } from '../components/StatCard';
import { ExamCard } from '../components/ExamCard';
import { ExamCreation } from '../components/ExamCreation';
import { ExamDetail } from '../components/ExamDetail';
import { CountdownWidget } from '../components/CountdownWidget';
import { Exam } from '../store/useAppStore';

export const HomePage: React.FC = () => {
  const { theme, profile, exams, toggleTheme, setActiveTab } = useAppStore();
  const isDark = theme === 'dark';
  const [showExamCreation, setShowExamCreation] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const bg = isDark ? '#0a0a0a' : '#f5f5f7';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const sectionBg = isDark ? 'rgba(22,22,24,0.9)' : 'rgba(255,255,255,0.9)';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  const upcomingExams = exams.filter((e) => e.status === 'upcoming').sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const completedExams = exams.filter((e) => e.status === 'completed');
  const thisWeekExams = upcomingExams.filter((e) => {
    const examDate = new Date(e.date);
    const now = new Date();
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return examDate >= now && examDate <= weekEnd;
  });

  const highPriorityExams = upcomingExams.filter(
    (e) => e.priority === 'high' || e.priority === 'critical'
  );

  const avgMarks = completedExams.length > 0
    ? Math.round(completedExams.filter((e) => e.obtainedMarks !== undefined).reduce((acc, e) => {
        const pct = ((e.obtainedMarks || 0) / e.fullMarks) * 100;
        return acc + pct;
      }, 0) / (completedExams.filter((e) => e.obtainedMarks !== undefined).length || 1))
    : 0;

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const nextExam = upcomingExams[0];

  return (
    <div style={{ width: '100%', height: '100%', background: bg, position: 'relative', overflow: 'hidden' }}>
      <div className="page-scroll" style={{ height: '100%', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '52px 24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ fontSize: 12, color: textSecondary, fontWeight: 300, marginBottom: 6, letterSpacing: 0.2 }}>
                {today}
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: textPrimary, letterSpacing: -0.8, lineHeight: 1.2 }}>
                {greetingTime()},
              </h1>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: textPrimary, letterSpacing: -0.8, lineHeight: 1.2 }}>
                {profile?.studentName?.split(' ')[0] || 'Student'} 👋
              </h1>
            </motion.div>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {/* Theme toggle */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={toggleTheme}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${border}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {isDark ? '☀️' : '🌙'}
              </motion.button>

              {/* Notification bell */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setActiveTab('notifications')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${border}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <Bell size={15} color={textPrimary} strokeWidth={1.5} />
                {thisWeekExams.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: 7,
                    right: 7,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isDark ? '#ffffff' : '#000000',
                    border: `1.5px solid ${bg}`,
                  }} />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Next Exam Countdown Widget */}
        {nextExam && (
          <div style={{ padding: '0 24px 8px' }}>
            <CountdownWidget exam={nextExam} isDark={isDark} />
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ padding: '8px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary, letterSpacing: -0.3 }}>
              Overview
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatCard
              icon={Calendar}
              label="Upcoming"
              value={upcomingExams.length}
              subtitle="exams scheduled"
              isDark={isDark}
              delay={0.05}
              highlight={upcomingExams.length > 0}
            />
            <StatCard
              icon={BookOpen}
              label="Subjects"
              value={profile?.subjects.length || 0}
              subtitle="total subjects"
              isDark={isDark}
              delay={0.1}
            />
            <StatCard
              icon={TrendingUp}
              label="Avg. Score"
              value={avgMarks > 0 ? `${avgMarks}%` : '—'}
              subtitle="performance"
              isDark={isDark}
              delay={0.15}
            />
            <StatCard
              icon={AlertTriangle}
              label="This Week"
              value={thisWeekExams.length}
              subtitle="coming up"
              isDark={isDark}
              delay={0.2}
              highlight={thisWeekExams.length > 0}
            />
            <StatCard
              icon={CheckCircle}
              label="Completed"
              value={completedExams.length}
              subtitle="exams done"
              isDark={isDark}
              delay={0.25}
            />
            <StatCard
              icon={Star}
              label="High Priority"
              value={highPriorityExams.length}
              subtitle="need attention"
              isDark={isDark}
              delay={0.3}
              highlight={highPriorityExams.length > 0}
            />
          </div>
        </div>

        {/* This Week section */}
        {thisWeekExams.length > 1 && (
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary, letterSpacing: -0.3 }}>
                This Week
              </h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('exams')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: textSecondary,
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                See all <ChevronRight size={14} />
              </motion.button>
            </div>
            <div style={{
              background: sectionBg,
              border: `1px solid ${border}`,
              borderRadius: 20,
              overflow: 'hidden',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}>
              {thisWeekExams.slice(0, 4).map((exam, i) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  onClick={() => setSelectedExam(exam)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: i < Math.min(thisWeekExams.length, 4) - 1
                      ? `1px solid ${border}`
                      : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: textPrimary, lineHeight: 1 }}>
                        {new Date(exam.date).getDate()}
                      </div>
                      <div style={{ fontSize: 9, color: textSecondary, marginTop: 1, fontWeight: 500 }}>
                        {new Date(exam.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>
                        {exam.subject}
                      </div>
                      <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
                        {exam.place} · {exam.time}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: 7,
                    background: exam.priority === 'critical' || exam.priority === 'high'
                      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                    fontSize: 11,
                    fontWeight: 600,
                    color: textPrimary,
                    textTransform: 'capitalize',
                  }}>
                    {exam.priority}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All upcoming exams */}
        {upcomingExams.length > 0 && (
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary, letterSpacing: -0.3 }}>
                Upcoming Exams
              </h2>
              <span style={{ fontSize: 13, color: textSecondary }}>
                {upcomingExams.length} total
              </span>
            </div>

            {upcomingExams.slice(0, 4).map((exam, i) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ExamCard
                  exam={exam}
                  isDark={isDark}
                  onPress={() => setSelectedExam(exam)}
                  compact
                />
                <div style={{ height: 8 }} />
              </motion.div>
            ))}

            {upcomingExams.length > 4 && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab('exams')}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 14,
                  background: 'transparent',
                  border: `1px solid ${border}`,
                  color: textSecondary,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                View all {upcomingExams.length} exams <ChevronRight size={14} />
              </motion.button>
            )}
          </div>
        )}

        {/* Empty state */}
        {upcomingExams.length === 0 && (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="animate-float" style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 32,
              }}>
                📚
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: textPrimary, marginBottom: 8, letterSpacing: -0.3 }}>
                No upcoming exams
              </div>
              <div style={{ fontSize: 14, color: textSecondary, fontWeight: 300, marginBottom: 24, lineHeight: 1.5 }}>
                Tap the + button below to schedule<br />your first exam.
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowExamCreation(true)}
                style={{
                  padding: '14px 28px',
                  borderRadius: 14,
                  background: isDark ? '#ffffff' : '#000000',
                  color: isDark ? '#000000' : '#ffffff',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <Plus size={16} /> Add Your First Exam
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* School info banner */}
        {profile?.schoolName && (
          <div style={{ padding: '0 24px 24px' }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                padding: '16px 20px',
                borderRadius: 16,
                background: sectionBg,
                border: `1px solid ${border}`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 10, color: textSecondary, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>SCHOOL</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>{profile.schoolName}</div>
                <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
                  Class {profile.className} · {profile.medium === 'bangla' ? 'Bangla Medium' : 'English Version'}
                  {profile.group ? ` · ${profile.group.charAt(0).toUpperCase() + profile.group.slice(1)}` : ''}
                </div>
              </div>
              <div style={{ fontSize: 28 }}>🏫</div>
            </motion.div>
          </div>
        )}

        {/* Recent completed exams */}
        {completedExams.length > 0 && (
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: textPrimary, letterSpacing: -0.3 }}>
                Recent Results
              </h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('stats')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none',
                  cursor: 'pointer', color: textSecondary, fontSize: 13, fontFamily: 'Inter, sans-serif',
                }}
              >
                Analytics <ChevronRight size={14} />
              </motion.button>
            </div>
            <div style={{
              background: sectionBg,
              border: `1px solid ${border}`,
              borderRadius: 20,
              overflow: 'hidden',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}>
              {completedExams.slice(0, 3).map((exam, i) => {
                const pct = exam.obtainedMarks !== undefined ? Math.round((exam.obtainedMarks / exam.fullMarks) * 100) : null;
                return (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    onClick={() => setSelectedExam(exam)}
                    style={{
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: i < Math.min(completedExams.length, 3) - 1 ? `1px solid ${border}` : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{exam.subject}</div>
                      <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
                        {new Date(exam.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    {pct !== null ? (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: textPrimary, letterSpacing: -0.5 }}>
                          {exam.obtainedMarks}/{exam.fullMarks}
                        </div>
                        <div style={{ fontSize: 11, color: textSecondary }}>{pct}%</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: textSecondary }}>No result</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom padding for nav */}
        <div style={{ height: 20 }} />
      </div>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowExamCreation(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
        className={isDark ? 'fab-dark' : 'fab-light'}
        style={{
          position: 'absolute',
          bottom: 100,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
      >
        <Plus size={22} color={isDark ? '#000000' : '#ffffff'} strokeWidth={2.5} />
      </motion.button>

      {/* Exam Creation Modal */}
      <AnimatePresence>
        {showExamCreation && (
          <ExamCreation onClose={() => setShowExamCreation(false)} isDark={isDark} />
        )}
      </AnimatePresence>

      {/* Exam Detail Modal */}
      <AnimatePresence>
        {selectedExam && (
          <ExamDetail exam={selectedExam} onClose={() => setSelectedExam(null)} isDark={isDark} />
        )}
      </AnimatePresence>
    </div>
  );
};
