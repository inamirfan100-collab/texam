import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Plus, X, Check } from 'lucide-react';
import { useAppStore, getSubjectsForClass, UserType, Medium, Group, Subject, Teacher } from '../store/useAppStore';

const TOTAL_STEPS = 8;

export const ProfileSetup: React.FC = () => {
  const { completeProfileSetup, setProfile, theme } = useAppStore();
  const isDark = theme === 'dark';

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [userType, setUserType] = useState<UserType | null>(null);
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState<number | null>(null);
  const [medium, setMedium] = useState<Medium | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schoolName, setSchoolName] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);

  // Teacher form
  const [teacherName, setTeacherName] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('');
  const [tuitionName, setTuitionName] = useState('');
  const [teacherLocation, setTeacherLocation] = useState('');

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

  const goNext = () => {
    let nextStep = step + 1;
    if (step === 3 && className && className < 9) {
      nextStep = 5; // Skip group selection for classes 1–8
    }
    setDirection(1);
    setStep(nextStep);
  };

  const goBack = () => {
    let prevStep = step - 1;
    if (step === 5 && className && className < 9) {
      prevStep = 3;
    }
    setDirection(-1);
    setStep(prevStep);
  };

  const handleClassSelect = (cls: number) => {
    setClassName(cls);
    setGroup(null);
    if (cls < 9) {
      const loaded = getSubjectsForClass(cls);
      setSubjects(loaded);
    }
  };

  const handleGroupSelect = (g: Group) => {
    setGroup(g);
    if (className) {
      const loaded = getSubjectsForClass(className, g);
      setSubjects(loaded);
    }
  };

  const addCustomSubject = () => {
    if (newSubject.trim()) {
      setSubjects((prev) => [...prev, { id: `custom-${Date.now()}`, name: newSubject.trim() }]);
      setNewSubject('');
      setShowAddSubject(false);
    }
  };

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const addTeacher = () => {
    if (teacherName.trim()) {
      setTeachers((prev) => [
        ...prev,
        {
          id: `t-${Date.now()}`,
          name: teacherName.trim(),
          subject: teacherSubject.trim(),
          tuitionName: tuitionName.trim(),
          location: teacherLocation.trim(),
        },
      ]);
      setTeacherName('');
      setTeacherSubject('');
      setTuitionName('');
      setTeacherLocation('');
    }
  };

  const handleFinish = () => {
    if (!userType || !studentName || !className || !medium) return;
    setProfile({
      userType,
      studentName,
      className,
      medium,
      group: group || undefined,
      schoolName,
      subjects,
      teachers,
    });
    completeProfileSetup();
  };

  const isStepValid = () => {
    switch (step) {
      case 0: return userType !== null;
      case 1: return studentName.trim().length > 0;
      case 2: return className !== null;
      case 3: return medium !== null;
      case 4: return className && className >= 9 ? group !== null : true;
      case 5: return true;
      case 6: return true;
      case 7: return true;
      default: return true;
    }
  };

  const stepTitles = [
    'Who are you?',
    "What's the student's name?",
    'Select class',
    'Select medium',
    'Select group',
    'Your subjects',
    'School name',
    'Tuition & teachers',
  ];

  const stepSubtitles = [
    'Choose your role in Texam',
    'This will personalize your experience',
    'NCTB curriculum Classes 1–10',
    'Choose your study medium',
    'For Classes 9–10',
    'Edit or add subjects as needed',
    'Your school information',
    'Add teachers and coaching details',
  ];

  const variants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: -dir * 40, opacity: 0 }),
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(['student', 'guardian'] as UserType[]).map((type) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType(type)}
                style={{
                  padding: '20px 24px',
                  borderRadius: 16,
                  border: `1.5px solid ${userType === type ? selectedBg : border}`,
                  background: userType === type ? selectedBg : cardBg,
                  color: userType === type ? selectedText : textPrimary,
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
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                    {type === 'student' ? '🎓 Student' : '👨‍👩‍👧 Guardian'}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.6, fontWeight: 300 }}>
                    {type === 'student' ? 'I manage my own exams' : 'I manage exams for my child'}
                  </div>
                </div>
                {userType === type && <Check size={18} />}
              </motion.button>
            ))}
          </div>
        );

      case 1:
        return (
          <div>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter full name..."
              autoFocus
              style={{
                width: '100%',
                padding: '18px 20px',
                borderRadius: 16,
                border: `1.5px solid ${studentName ? (isDark ? '#ffffff' : '#000000') : border}`,
                background: inputBg,
                color: textPrimary,
                fontSize: 18,
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                transition: 'border-color 0.2s',
              }}
            />
          </div>
        );

      case 2:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((cls) => (
              <motion.button
                key={cls}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClassSelect(cls)}
                style={{
                  padding: '18px',
                  borderRadius: 14,
                  border: `1.5px solid ${className === cls ? selectedBg : border}`,
                  background: className === cls ? selectedBg : cardBg,
                  color: className === cls ? selectedText : textPrimary,
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: 'pointer',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                Class {cls}
              </motion.button>
            ))}
          </div>
        );

      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(['bangla', 'english'] as Medium[]).map((med) => (
              <motion.button
                key={med}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMedium(med)}
                style={{
                  padding: '20px 24px',
                  borderRadius: 16,
                  border: `1.5px solid ${medium === med ? selectedBg : border}`,
                  background: medium === med ? selectedBg : cardBg,
                  color: medium === med ? selectedText : textPrimary,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {med === 'bangla' ? '🇧🇩 Bangla Medium' : '🌐 English Version'}
                </div>
                {medium === med && <Check size={18} />}
              </motion.button>
            ))}
          </div>
        );

      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(['science', 'business', 'humanities'] as Group[]).map((g) => (
              <motion.button
                key={g}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGroupSelect(g)}
                style={{
                  padding: '20px 24px',
                  borderRadius: 16,
                  border: `1.5px solid ${group === g ? selectedBg : border}`,
                  background: group === g ? selectedBg : cardBg,
                  color: group === g ? selectedText : textPrimary,
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
                  <div style={{ fontSize: 16, fontWeight: 600 }}>
                    {g === 'science' ? '🔬 Science' : g === 'business' ? '📊 Business Studies' : '📚 Humanities'}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.6, fontWeight: 300, marginTop: 4 }}>
                    {g === 'science' ? 'Physics, Chemistry, Biology...' : g === 'business' ? 'Accounting, Economics...' : 'History, Civics, Geography...'}
                  </div>
                </div>
                {group === g && <Check size={18} />}
              </motion.button>
            ))}
          </div>
        );

      case 5:
        return (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {subjects.map((sub) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    background: cardBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, color: textPrimary }}>{sub.name}</span>
                  <button
                    onClick={() => removeSubject(sub.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, padding: 4 }}
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </div>

            {showAddSubject ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Subject name..."
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSubject()}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: `1.5px solid ${border}`,
                    background: inputBg,
                    color: textPrimary,
                    fontSize: 14,
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addCustomSubject}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: btnBg,
                    color: btnText,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  Add
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAddSubject(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 12,
                  border: `1.5px dashed ${border}`,
                  background: 'transparent',
                  color: textSecondary,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Plus size={16} /> Add Custom Subject
              </motion.button>
            )}
          </div>
        );

      case 6:
        return (
          <div>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Dhaka Residential Model College"
              autoFocus
              style={{
                width: '100%',
                padding: '18px 20px',
                borderRadius: 16,
                border: `1.5px solid ${schoolName ? (isDark ? '#ffffff' : '#000000') : border}`,
                background: inputBg,
                color: textPrimary,
                fontSize: 16,
                fontWeight: 400,
                fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.2s',
              }}
            />
            <p style={{ fontSize: 12, color: textSecondary, marginTop: 10, fontWeight: 300 }}>
              You can skip this and add later from Profile.
            </p>
          </div>
        );

      case 7:
        return (
          <div>
            {teachers.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                {teachers.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: `1px solid ${border}`,
                      background: cardBg,
                      marginBottom: 8,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: textPrimary }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: textSecondary }}>
                        {t.subject}{t.tuitionName ? ` · ${t.tuitionName}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => setTeachers((prev) => prev.filter((x) => x.id !== t.id))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{
              padding: '16px',
              borderRadius: 16,
              border: `1px solid ${border}`,
              background: cardBg,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 12 }}>Add Teacher / Tuition</div>
              {[
                { label: 'Teacher Name *', value: teacherName, setter: setTeacherName, placeholder: 'e.g. Mr. Rahman' },
                { label: 'Subject', value: teacherSubject, setter: setTeacherSubject, placeholder: 'e.g. Physics' },
                { label: 'Tuition / Coaching Name', value: tuitionName, setter: setTuitionName, placeholder: 'e.g. Comfort Academy' },
                { label: 'Location (optional)', value: teacherLocation, setter: setTeacherLocation, placeholder: 'e.g. Mirpur, Dhaka' },
              ].map((field) => (
                <div key={field.label} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: textSecondary, marginBottom: 5, fontWeight: 500 }}>{field.label}</div>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: `1px solid ${border}`,
                      background: inputBg,
                      color: textPrimary,
                      fontSize: 14,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  />
                </div>
              ))}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={addTeacher}
                disabled={!teacherName.trim()}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  background: teacherName.trim() ? btnBg : inputBg,
                  color: teacherName.trim() ? btnText : textSecondary,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: teacherName.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Plus size={16} /> Add Teacher
              </motion.button>
            </div>
            <p style={{ fontSize: 12, color: textSecondary, marginTop: 10, fontWeight: 300 }}>
              You can add more teachers later from Profile.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div className="theme-transition" style={{
      width: '100%',
      height: '100%',
      background: bg,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '52px 28px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          {step > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goBack}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, padding: 0 }}
            >
              <ChevronLeft size={22} />
            </motion.button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 2,
                    borderRadius: 1,
                    background: i <= step ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#333333' : '#e0e0e0'),
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
          </div>
          <span style={{ fontSize: 12, color: textSecondary, minWidth: 32, textAlign: 'right' }}>
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>

        <motion.div
          key={step + '-header'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: textPrimary, letterSpacing: -0.7, marginBottom: 6 }}>
            {stepTitles[step]}
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: textSecondary, fontWeight: 300, lineHeight: 1.5 }}>
            {stepSubtitles[step]}
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="page-scroll" style={{ flex: 1, padding: '0 28px', paddingBottom: 16 }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 28px 48px' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={isLastStep ? handleFinish : goNext}
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
          {isLastStep ? 'Enter Texam →' : <>Continue <ChevronRight size={18} /></>}
        </motion.button>
      </div>
    </div>
  );
};
