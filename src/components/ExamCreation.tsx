import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Check, Search } from 'lucide-react';
import { useAppStore, Exam, ExamPlace, Priority, QuestionPattern } from '../store/useAppStore';

interface ExamCreationProps {
  onClose: () => void;
  isDark: boolean;
}

const NCTB_CHAPTERS: Record<string, string[]> = {
  physics: ['Chapter 1: Physical World', 'Chapter 2: Units & Measurement', 'Chapter 3: Motion', 'Chapter 4: Laws of Motion', 'Chapter 5: Work, Energy & Power', 'Chapter 6: Gravitation', 'Chapter 7: Thermodynamics', 'Chapter 8: Waves & Sound', 'Chapter 9: Light', 'Chapter 10: Electricity'],
  chemistry: ['Chapter 1: Introduction to Chemistry', 'Chapter 2: Periodic Table', 'Chapter 3: States of Matter', 'Chapter 4: Chemical Bonding', 'Chapter 5: Acids & Bases', 'Chapter 6: Oxidation & Reduction', 'Chapter 7: Organic Chemistry', 'Chapter 8: Metals & Non-metals'],
  biology: ['Chapter 1: Introduction to Biology', 'Chapter 2: Cell Biology', 'Chapter 3: Cell Division', 'Chapter 4: Bioenergetics', 'Chapter 5: Nutrition', 'Chapter 6: Respiration', 'Chapter 7: Transportation', 'Chapter 8: Coordination', 'Chapter 9: Genetics'],
  genmath: ['Chapter 1: Sets', 'Chapter 2: Algebra', 'Chapter 3: Geometry', 'Chapter 4: Trigonometry', 'Chapter 5: Statistics', 'Chapter 6: Coordinate Geometry', 'Chapter 7: Mensuration'],
  bangla1: ['গদ্য', 'পদ্য', 'সহপাঠ', 'ব্যাকরণ', 'রচনা'],
  english1: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'Writing Skills', 'Grammar'],
};

const getChaptersForSubject = (subjectId: string): string[] => {
  return NCTB_CHAPTERS[subjectId] || [
    'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5',
    'Chapter 6', 'Chapter 7', 'Chapter 8',
  ];
};

export const ExamCreation: React.FC<ExamCreationProps> = ({ onClose, isDark }) => {
  const { profile, addExam } = useAppStore();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [duration, setDuration] = useState('');
  const [place, setPlace] = useState<ExamPlace | null>(null);
  const [teacherId, setTeacherId] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [chapters, setChapters] = useState<string[]>([]);
  const [chapterSearch, setChapterSearch] = useState('');
  const [customChapter, setCustomChapter] = useState('');
  const [questionPatterns, setQuestionPatterns] = useState<QuestionPattern[]>([]);
  const [fullMarks, setFullMarks] = useState('100');
  const [passMarks, setPassMarks] = useState('33');
  const [priority, setPriority] = useState<Priority | null>(null);
  const [reminders, setReminders] = useState<string[]>(['1 day before', '1 hour before']);

  const bg = isDark ? '#0a0a0a' : '#fafafa';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const cardBg = isDark ? 'rgba(28,28,30,0.9)' : 'rgba(255,255,255,0.9)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const selectedBg = isDark ? '#ffffff' : '#000000';
  const selectedText = isDark ? '#000000' : '#ffffff';
  const btnBg = isDark ? '#ffffff' : '#000000';
  const btnText = isDark ? '#000000' : '#ffffff';
  const metaBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const TOTAL_STEPS = 8;

  const goNext = () => { setDirection(1); setStep((p) => p + 1); };
  const goBack = () => { setDirection(-1); setStep((p) => p - 1); };

  const toggleChapter = (ch: string) => {
    setChapters((prev) => prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]);
  };

  const toggleQP = (qp: QuestionPattern) => {
    setQuestionPatterns((prev) => prev.includes(qp) ? prev.filter((q) => q !== qp) : [...prev, qp]);
  };

  const toggleReminder = (r: string) => {
    setReminders((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  };

  const addCustomChapter = () => {
    if (customChapter.trim()) {
      setChapters((prev) => [...prev, customChapter.trim()]);
      setCustomChapter('');
    }
  };

  const handleSubmit = () => {
    if (!examDate || !examTime || !place || !selectedSubject || !priority) return;
    const exam: Exam = {
      id: `exam-${Date.now()}`,
      subject: selectedSubject,
      subjectId: selectedSubjectId,
      date: examDate,
      time: examTime,
      duration: duration ? parseInt(duration) : undefined,
      place,
      teacherName: teacherName || undefined,
      chapters,
      questionPatterns,
      fullMarks: parseInt(fullMarks) || 100,
      passMarks: passMarks ? parseInt(passMarks) : undefined,
      priority,
      status: 'upcoming',
      reminders,
      createdAt: new Date().toISOString(),
    };
    addExam(exam);
    onClose();
  };

  const isStepValid = () => {
    switch (step) {
      case 0: return examDate && examTime;
      case 1: return place !== null;
      case 2: return selectedSubject !== '';
      case 3: return true;
      case 4: return questionPatterns.length > 0;
      case 5: return fullMarks !== '';
      case 6: return priority !== null;
      case 7: return true;
      default: return true;
    }
  };

  const stepTitles = ['When is the exam?', 'Where is the exam?', 'Which subject?', 'Select chapters', 'Question pattern', 'Marks', 'Priority', 'Reminders'];

  const availableChapters = getChaptersForSubject(selectedSubjectId);
  const filteredChapters = availableChapters.filter((ch) =>
    ch.toLowerCase().includes(chapterSearch.toLowerCase())
  );

  const renderCountdownPreview = () => {
    if (!examDate || !examTime) return null;
    const examDateTime = new Date(`${examDate}T${examTime}:00`);
    const now = new Date();
    const diff = examDateTime.getTime() - now.getTime();
    if (diff <= 0) return <span style={{ color: textSecondary, fontSize: 13 }}>Exam already passed</span>;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return (
      <div style={{
        padding: '12px 16px',
        borderRadius: 12,
        background: metaBg,
        border: `1px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: textPrimary }}>{days}d {hours}h</span>
        <span style={{ fontSize: 13, color: textSecondary }}>until exam</span>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8, fontWeight: 500 }}>DATE *</div>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 14,
                  border: `1.5px solid ${examDate ? selectedBg : border}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 15,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8, fontWeight: 500 }}>TIME *</div>
              <input
                type="time"
                value={examTime}
                onChange={(e) => setExamTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 14,
                  border: `1.5px solid ${examTime ? selectedBg : border}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 15,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8, fontWeight: 500 }}>DURATION (minutes, optional)</div>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 180"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 14,
                  border: `1.5px solid ${border}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 15,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
            {examDate && examTime && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                {renderCountdownPreview()}
              </motion.div>
            )}
          </div>
        );

      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(['school', 'tuition', 'coaching', 'practice'] as ExamPlace[]).map((p) => (
              <motion.button
                key={p}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPlace(p)}
                style={{
                  padding: '18px 20px',
                  borderRadius: 16,
                  border: `1.5px solid ${place === p ? selectedBg : border}`,
                  background: place === p ? selectedBg : cardBg,
                  color: place === p ? selectedText : textPrimary,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>
                    {p === 'school' ? '🏫 School' : p === 'tuition' ? '📖 Tuition' : p === 'coaching' ? '🎯 Coaching Center' : '✏️ Practice Exam'}
                  </div>
                  {p === 'tuition' && profile?.teachers && profile.teachers.length > 0 && (
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 3 }}>
                      {profile.teachers.map((t) => t.name).join(', ')}
                    </div>
                  )}
                </div>
                {place === p && <Check size={16} />}
              </motion.button>
            ))}

            {place === 'tuition' && profile?.teachers && (
              <div>
                <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8, marginTop: 4 }}>SELECT TEACHER</div>
                {profile.teachers.map((t) => (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setTeacherId(t.id); setTeacherName(t.name); }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: `1px solid ${teacherId === t.id ? selectedBg : border}`,
                      background: teacherId === t.id ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : metaBg,
                      color: textPrimary,
                      textAlign: 'left',
                      cursor: 'pointer',
                      marginBottom: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: textSecondary }}>{t.subject}</div>
                    </div>
                    {teacherId === t.id && <Check size={14} />}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {profile?.subjects.map((sub) => (
              <motion.button
                key={sub.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedSubject(sub.name); setSelectedSubjectId(sub.id); setChapters([]); }}
                style={{
                  padding: '16px 18px',
                  borderRadius: 14,
                  border: `1.5px solid ${selectedSubject === sub.name ? selectedBg : border}`,
                  background: selectedSubject === sub.name ? selectedBg : cardBg,
                  color: selectedSubject === sub.name ? selectedText : textPrimary,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                {sub.name}
                {selectedSubject === sub.name && <Check size={16} />}
              </motion.button>
            ))}
          </div>
        );

      case 3:
        return (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              borderRadius: 12,
              background: metaBg,
              border: `1px solid ${border}`,
              marginBottom: 12,
            }}>
              <Search size={14} color={textSecondary} strokeWidth={1.5} />
              <input
                type="text"
                value={chapterSearch}
                onChange={(e) => setChapterSearch(e.target.value)}
                placeholder="Search chapters..."
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: textPrimary,
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {filteredChapters.map((ch) => (
                <motion.button
                  key={ch}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleChapter(ch)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: `1px solid ${chapters.includes(ch) ? selectedBg : border}`,
                    background: chapters.includes(ch) ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') : cardBg,
                    color: textPrimary,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `1.5px solid ${chapters.includes(ch) ? selectedBg : border}`,
                    background: chapters.includes(ch) ? selectedBg : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {chapters.includes(ch) && <Check size={10} color={selectedText} />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 400 }}>{ch}</span>
                </motion.button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={customChapter}
                onChange={(e) => setCustomChapter(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomChapter()}
                placeholder="Add custom chapter..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: `1px solid ${border}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addCustomChapter}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: btnBg,
                  color: btnText,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                <Plus size={16} />
              </motion.button>
            </div>

            {chapters.length > 0 && (
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: metaBg }}>
                <span style={{ fontSize: 12, color: textSecondary }}>{chapters.length} chapter{chapters.length > 1 ? 's' : ''} selected</span>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(['MCQ', 'SQ', 'CQ'] as QuestionPattern[]).map((qp) => (
                <motion.button
                  key={qp}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleQP(qp)}
                  style={{
                    padding: '20px 24px',
                    borderRadius: 16,
                    border: `1.5px solid ${questionPatterns.includes(qp) ? selectedBg : border}`,
                    background: questionPatterns.includes(qp) ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') : cardBg,
                    color: textPrimary,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{qp}</div>
                    <div style={{ fontSize: 12, color: textSecondary, marginTop: 3 }}>
                      {qp === 'MCQ' ? 'Multiple Choice Questions' : qp === 'SQ' ? 'Short Questions' : 'Creative / Structured Questions'}
                    </div>
                  </div>
                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `1.5px solid ${questionPatterns.includes(qp) ? selectedBg : border}`,
                    background: questionPatterns.includes(qp) ? selectedBg : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {questionPatterns.includes(qp) && <Check size={12} color={selectedText} />}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8, fontWeight: 500 }}>FULL MARKS *</div>
              <input
                type="number"
                value={fullMarks}
                onChange={(e) => setFullMarks(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 14,
                  border: `1.5px solid ${fullMarks ? selectedBg : border}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 22,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'center',
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {[50, 75, 100].map((m) => (
                  <motion.button
                    key={m}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFullMarks(String(m))}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 10,
                      border: `1px solid ${fullMarks === String(m) ? selectedBg : border}`,
                      background: fullMarks === String(m) ? selectedBg : metaBg,
                      color: fullMarks === String(m) ? selectedText : textPrimary,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {m}
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8, fontWeight: 500 }}>PASS MARKS (optional)</div>
              <input
                type="number"
                value={passMarks}
                onChange={(e) => setPassMarks(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 18,
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'center',
                }}
              />
            </div>
          </div>
        );

      case 6:
        const priorityOptions: { value: Priority; label: string; desc: string; emoji: string }[] = [
          { value: 'critical', label: 'Critical', desc: 'This is a major exam — top priority', emoji: '🔴' },
          { value: 'high', label: 'High', desc: 'Very important, needs serious prep', emoji: '🟠' },
          { value: 'medium', label: 'Medium', desc: 'Standard preparation needed', emoji: '🟡' },
          { value: 'low', label: 'Low', desc: 'Quick review should be enough', emoji: '🟢' },
        ];
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {priorityOptions.map((p) => (
              <motion.button
                key={p.value}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPriority(p.value)}
                style={{
                  padding: '18px 20px',
                  borderRadius: 16,
                  border: `1.5px solid ${priority === p.value ? selectedBg : border}`,
                  background: priority === p.value ? selectedBg : cardBg,
                  color: priority === p.value ? selectedText : textPrimary,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{p.emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{p.label}</div>
                    <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{p.desc}</div>
                  </div>
                </div>
                {priority === p.value && <Check size={16} />}
              </motion.button>
            ))}
          </div>
        );

      case 7:
        const reminderOptions = ['1 day before', '2 days before', '1 hour before', '30 minutes before', '1 week before', 'Morning of exam'];
        return (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reminderOptions.map((r) => (
                <motion.button
                  key={r}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleReminder(r)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 14,
                    border: `1px solid ${reminders.includes(r) ? selectedBg : border}`,
                    background: reminders.includes(r) ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)') : cardBg,
                    color: textPrimary,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    fontSize: 14,
                    fontWeight: 400,
                  }}
                >
                  {r}
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `1.5px solid ${reminders.includes(r) ? selectedBg : border}`,
                    background: reminders.includes(r) ? selectedBg : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {reminders.includes(r) && <Check size={10} color={selectedText} />}
                  </div>
                </motion.button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: textSecondary, marginTop: 12, fontWeight: 300 }}>
              In-app notifications will be shown at the selected times.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: -dir * 40, opacity: 0 }),
  };

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="theme-transition"
      style={{
        position: 'absolute',
        inset: 0,
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 200,
      }}
    >
      {/* Header */}
      <div style={{ padding: '52px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={step === 0 ? onClose : goBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, padding: 0 }}
          >
            {step === 0 ? <X size={22} /> : <ChevronLeft size={22} />}
          </motion.button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 2,
                    borderRadius: 1,
                    background: i <= step ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#333333' : '#e5e5e5'),
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
          </div>
          <span style={{ fontSize: 12, color: textSecondary }}>{step + 1}/{TOTAL_STEPS}</span>
        </div>

        <motion.div
          key={step + '-title'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: textPrimary, letterSpacing: -0.5 }}>
            {stepTitles[step]}
          </h2>
        </motion.div>
      </div>

      {/* Content */}
      <div className="page-scroll" style={{ flex: 1, padding: '0 24px', paddingBottom: 16 }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 24px 48px' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={isLastStep ? handleSubmit : goNext}
          disabled={!isStepValid()}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 16,
            background: isStepValid() ? btnBg : (isDark ? '#222' : '#f0f0f0'),
            color: isStepValid() ? btnText : textSecondary,
            border: 'none',
            fontSize: 15,
            fontWeight: 600,
            cursor: isStepValid() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.25s',
          }}
        >
          {isLastStep ? 'Create Exam ✓' : <>Continue <ChevronRight size={18} /></>}
        </motion.button>
      </div>
    </motion.div>
  );
};
