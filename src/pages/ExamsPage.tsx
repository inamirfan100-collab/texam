import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Plus, X } from 'lucide-react';
import { useAppStore, Exam, ExamStatus } from '../store/useAppStore';
import { ExamCard } from '../components/ExamCard';
import { ExamDetail } from '../components/ExamDetail';
import { ExamCreation } from '../components/ExamCreation';

export const ExamsPage: React.FC = () => {
  const { theme, exams } = useAppStore();
  const isDark = theme === 'dark';

  const [activeFilter, setActiveFilter] = useState<ExamStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [placeFilter, setPlaceFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showExamCreation, setShowExamCreation] = useState(false);

  const bg = isDark ? '#0a0a0a' : '#f5f5f7';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
  const filterActiveBg = isDark ? '#ffffff' : '#000000';
  const filterActiveText = isDark ? '#000000' : '#ffffff';
  const filterBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.9)';
  const cardBg = isDark ? 'rgba(28,28,30,0.9)' : 'rgba(255,255,255,0.9)';

  const filteredExams = exams.filter((e) => {
    if (activeFilter !== 'all' && e.status !== activeFilter) return false;
    if (placeFilter !== 'all' && e.place !== placeFilter) return false;
    if (priorityFilter !== 'all' && e.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.subject.toLowerCase().includes(q) ||
        e.chapters.some((ch) => ch.toLowerCase().includes(q));
    }
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const statusCounts = {
    all: exams.length,
    upcoming: exams.filter((e) => e.status === 'upcoming').length,
    completed: exams.filter((e) => e.status === 'completed').length,
    missed: exams.filter((e) => e.status === 'missed').length,
  };

  const filterTabs: { key: ExamStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Done' },
    { key: 'missed', label: 'Missed' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', background: bg, position: 'relative', overflow: 'hidden' }}>
      <div className="page-scroll" style={{ height: '100%', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '56px 24px 20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}
          >
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: textPrimary, letterSpacing: -0.7 }}>
              Exams
            </h1>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExamCreation(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: isDark ? '#ffffff' : '#000000',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={18} color={isDark ? '#000000' : '#ffffff'} strokeWidth={2} />
            </motion.button>
          </motion.div>

          {/* Search bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 14,
            background: inputBg,
            border: `1px solid ${border}`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            marginBottom: 16,
          }}>
            <Search size={15} color={textSecondary} strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exams, chapters..."
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: textPrimary,
                fontSize: 14,
                fontFamily: 'Inter, sans-serif',
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary }}>
                <X size={14} />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: showFilters ? (isDark ? '#ffffff' : '#000000') : 'none',
                border: 'none',
                cursor: 'pointer',
                color: showFilters ? (isDark ? '#000000' : '#ffffff') : textSecondary,
                borderRadius: 8,
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: 16 }}
              >
                <div style={{
                  padding: '16px',
                  borderRadius: 14,
                  background: cardBg,
                  border: `1px solid ${border}`,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}>
                  <div style={{ fontSize: 11, color: textSecondary, fontWeight: 600, marginBottom: 10, letterSpacing: 0.5 }}>EXAM PLACE</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {['all', 'school', 'tuition', 'coaching', 'practice'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setPlaceFilter(f)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: `1px solid ${placeFilter === f ? filterActiveBg : border}`,
                          background: placeFilter === f ? filterActiveBg : 'transparent',
                          color: placeFilter === f ? filterActiveText : textSecondary,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                        }}
                      >
                        {f === 'all' ? 'All Places' : f}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: textSecondary, fontWeight: 600, marginBottom: 10, letterSpacing: 0.5 }}>PRIORITY</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setPriorityFilter(f)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: `1px solid ${priorityFilter === f ? filterActiveBg : border}`,
                          background: priorityFilter === f ? filterActiveBg : 'transparent',
                          color: priorityFilter === f ? filterActiveText : textSecondary,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                        }}
                      >
                        {f === 'all' ? 'All Priorities' : f}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {filterTabs.map((tab) => (
              <motion.button
                key={tab.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(tab.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: `1px solid ${activeFilter === tab.key ? filterActiveBg : border}`,
                  background: activeFilter === tab.key ? filterActiveBg : filterBg,
                  color: activeFilter === tab.key ? filterActiveText : textSecondary,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  flexShrink: 0,
                }}
              >
                {tab.label} ({statusCounts[tab.key]})
              </motion.button>
            ))}
          </div>
        </div>

        {/* Exam list */}
        <div style={{ padding: '0 24px' }}>
          {filteredExams.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '48px 0' }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: textPrimary, marginBottom: 8 }}>No exams found</div>
              <div style={{ fontSize: 13, color: textSecondary }}>
                {searchQuery ? 'Try a different search term' : 'No exams in this category'}
              </div>
            </motion.div>
          ) : (
            filteredExams.map((exam, i) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
                <ExamCard
                  exam={exam}
                  isDark={isDark}
                  onPress={() => setSelectedExam(exam)}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setShowExamCreation(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
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
        <Plus size={22} color={isDark ? '#000000' : '#ffffff'} strokeWidth={2} />
      </motion.button>

      {/* Modals */}
      <AnimatePresence>
        {selectedExam && (
          <ExamDetail exam={selectedExam} onClose={() => setSelectedExam(null)} isDark={isDark} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showExamCreation && (
          <ExamCreation onClose={() => setShowExamCreation(false)} isDark={isDark} />
        )}
      </AnimatePresence>
    </div>
  );
};
