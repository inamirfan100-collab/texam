import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, School, BookOpen, Users, Settings, Moon, Sun, Plus, X, Download, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const ProfilePage: React.FC = () => {
  const { theme, toggleTheme, profile, addSubject, removeSubject, addTeacher, removeTeacher } = useAppStore();
  const isDark = theme === 'dark';

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTuitionName, setNewTuitionName] = useState('');

  const bg = isDark ? '#0a0a0a' : '#f5f5f7';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const cardBg = isDark ? 'rgba(22,22,24,0.9)' : 'rgba(255,255,255,0.9)';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const metaBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
  const btnBg = isDark ? '#ffffff' : '#000000';
  const btnText = isDark ? '#000000' : '#ffffff';
  const divider = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      addSubject({ id: `custom-${Date.now()}`, name: newSubjectName.trim() });
      setNewSubjectName('');
    }
  };

  const handleAddTeacher = () => {
    if (newTeacherName.trim()) {
      addTeacher({
        id: `t-${Date.now()}`,
        name: newTeacherName.trim(),
        subject: newTeacherSubject.trim(),
        tuitionName: newTuitionName.trim(),
      });
      setNewTeacherName('');
      setNewTeacherSubject('');
      setNewTuitionName('');
    }
  };

  const SectionCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    sectionKey: string;
    children: React.ReactNode;
  }> = ({ title, icon, sectionKey, children }) => (
    <div style={{
      borderRadius: 20,
      background: cardBg,
      border: `1px solid ${border}`,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      overflow: 'hidden',
      marginBottom: 12,
    }}>
      <button
        onClick={() => setActiveSection(activeSection === sectionKey ? null : sectionKey)}
        style={{
          width: '100%',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: metaBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: textPrimary }}>{title}</span>
        </div>
        <motion.div
          animate={{ rotate: activeSection === sectionKey ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} color={textSecondary} />
        </motion.div>
      </button>
      <AnimatePresence>
        {activeSection === sectionKey && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', borderTop: `1px solid ${divider}` }}
          >
            <div style={{ padding: '16px 20px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', background: bg, overflow: 'hidden' }}>
      <div className="page-scroll" style={{ height: '100%', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '56px 24px 24px' }}>
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 28 }}
          >
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              border: `2px solid ${border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 32,
            }}>
              {profile?.userType === 'guardian' ? '👨‍👩‍👧' : '🎓'}
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: textPrimary, letterSpacing: -0.5 }}>
              {profile?.studentName || 'Student'}
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: textSecondary, fontWeight: 300 }}>
              Class {profile?.className} · {profile?.medium === 'bangla' ? 'Bangla Medium' : 'English Version'}
              {profile?.group ? ` · ${profile.group.charAt(0).toUpperCase() + profile.group.slice(1)}` : ''}
            </p>
          </motion.div>
        </div>

        <div style={{ padding: '0 24px' }}>
          {/* Student Info */}
          <SectionCard title="Student Info" icon={<User size={16} color={textSecondary} strokeWidth={1.5} />} sectionKey="student">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Name', value: profile?.studentName || '—' },
                { label: 'Class', value: profile?.className ? `Class ${profile.className}` : '—' },
                { label: 'Medium', value: profile?.medium === 'bangla' ? 'Bangla Medium' : 'English Version' },
                { label: 'Group', value: profile?.group ? (profile.group.charAt(0).toUpperCase() + profile.group.slice(1)) : 'N/A' },
                { label: 'User Type', value: profile?.userType === 'guardian' ? 'Guardian' : 'Student' },
              ].map((item) => (
                <div key={item.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: metaBg,
                }}>
                  <span style={{ fontSize: 12, color: textSecondary, fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{item.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* School Info */}
          <SectionCard title="School" icon={<School size={16} color={textSecondary} strokeWidth={1.5} />} sectionKey="school">
            <div style={{ padding: '10px 14px', borderRadius: 10, background: metaBg, marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 4 }}>School Name</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: textPrimary }}>{profile?.schoolName || 'Not set'}</div>
            </div>
            <p style={{ fontSize: 12, color: textSecondary, margin: 0, fontWeight: 300 }}>
              Edit school name coming soon in a future update.
            </p>
          </SectionCard>

          {/* Subjects */}
          <SectionCard title="Subjects" icon={<BookOpen size={16} color={textSecondary} strokeWidth={1.5} />} sectionKey="subjects">
            <div style={{ marginBottom: 12 }}>
              {profile?.subjects.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: metaBg,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, color: textPrimary }}>{sub.name}</span>
                  <button
                    onClick={() => removeSubject(sub.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, padding: 4 }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                placeholder="Add subject..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: `1px solid ${border}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 14,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddSubject}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: btnBg,
                  color: btnText,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
              </motion.button>
            </div>
          </SectionCard>

          {/* Teachers & Tuition */}
          <SectionCard title="Teachers & Tuition" icon={<Users size={16} color={textSecondary} strokeWidth={1.5} />} sectionKey="teachers">
            <div style={{ marginBottom: 14 }}>
              {profile?.teachers.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: metaBg,
                    marginBottom: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
                      {t.subject}{t.tuitionName ? ` · ${t.tuitionName}` : ''}
                      {t.location ? ` · ${t.location}` : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => removeTeacher(t.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {(!profile?.teachers || profile.teachers.length === 0) && (
                <p style={{ fontSize: 13, color: textSecondary, margin: '0 0 12px' }}>No teachers added yet.</p>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Teacher Name *', value: newTeacherName, setter: setNewTeacherName, placeholder: 'e.g. Mr. Rahman' },
                { label: 'Subject', value: newTeacherSubject, setter: setNewTeacherSubject, placeholder: 'e.g. Physics' },
                { label: 'Tuition / Coaching', value: newTuitionName, setter: setNewTuitionName, placeholder: 'e.g. Comfort Academy' },
              ].map((field) => (
                <div key={field.label}>
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
                onClick={handleAddTeacher}
                disabled={!newTeacherName.trim()}
                style={{
                  padding: '12px',
                  borderRadius: 12,
                  background: newTeacherName.trim() ? btnBg : metaBg,
                  color: newTeacherName.trim() ? btnText : textSecondary,
                  border: 'none',
                  cursor: newTeacherName.trim() ? 'pointer' : 'default',
                  fontSize: 14,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <Plus size={16} /> Add Teacher
              </motion.button>
            </div>
          </SectionCard>

          {/* Settings */}
          <SectionCard title="Settings" icon={<Settings size={16} color={textSecondary} strokeWidth={1.5} />} sectionKey="settings">
            <div>
              {/* Theme */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: `1px solid ${divider}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {isDark ? <Moon size={16} color={textSecondary} strokeWidth={1.5} /> : <Sun size={16} color={textSecondary} strokeWidth={1.5} />}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: textPrimary }}>
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </div>
                    <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
                      {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  style={{
                    width: 44,
                    height: 26,
                    borderRadius: 13,
                    background: isDark ? '#ffffff' : '#000000',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 3,
                    left: isDark ? 21 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: isDark ? '#000000' : '#ffffff',
                    transition: 'left 0.25s',
                  }} />
                </motion.button>
              </div>

              {/* Export data */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom: `1px solid ${divider}`,
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Download size={16} color={textSecondary} strokeWidth={1.5} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: textPrimary }}>Export Data</div>
                    <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>Download your exam records</div>
                  </div>
                </div>
                <ChevronRight size={14} color={textSecondary} />
              </div>

              <div style={{ padding: '14px 0' }}>
                <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8 }}>APP VERSION</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: textPrimary }}>Texam v1.0.0</div>
                <div style={{ fontSize: 12, color: textSecondary, marginTop: 4 }}>
                  Built for NCTB Curriculum · Bangladesh
                </div>
              </div>
            </div>
          </SectionCard>

          {/* AI Features Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '20px',
              borderRadius: 20,
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px dashed ${border}`,
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>🤖</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 6 }}>
              AI Features Coming Soon
            </div>
            <div style={{ fontSize: 12, color: textSecondary, lineHeight: 1.5, fontWeight: 300 }}>
              AI study planning, revision schedules, weakness analysis, and chapter recommendations will be available in a future update.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
