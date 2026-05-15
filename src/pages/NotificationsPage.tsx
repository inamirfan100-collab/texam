import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, BookOpen, BarChart2, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface Notification {
  id: string;
  type: 'reminder' | 'summary' | 'alert' | 'achievement';
  title: string;
  body: string;
  time: string;
  icon: React.ReactNode;
  read: boolean;
}

export const NotificationsPage: React.FC = () => {
  const { theme, exams } = useAppStore();
  const isDark = theme === 'dark';

  const bg = isDark ? '#0a0a0a' : '#f5f5f7';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const cardBg = isDark ? 'rgba(22,22,24,0.9)' : 'rgba(255,255,255,0.9)';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const metaBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const unreadBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
  const dot = isDark ? '#ffffff' : '#000000';

  const upcomingExams = exams.filter((e) => e.status === 'upcoming').sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const notifications: Notification[] = [
    ...(upcomingExams.slice(0, 2).map((e, i) => {
      const examDate = new Date(e.date);
      const now = new Date();
      const diff = examDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return {
        id: `exam-${e.id}`,
        type: 'reminder' as const,
        title: days <= 1 ? `Exam Tomorrow: ${e.subject}` : `Upcoming: ${e.subject}`,
        body: `${e.place === 'school' ? 'School' : 'Tuition'} exam on ${examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${e.time}. ${e.chapters.length} chapter${e.chapters.length > 1 ? 's' : ''} to cover.`,
        time: days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`,
        icon: <Clock size={16} color={textPrimary} strokeWidth={1.5} />,
        read: i > 0,
      };
    })),
    {
      id: 'summary-1',
      type: 'summary',
      title: 'Daily Academic Summary',
      body: `You have ${upcomingExams.length} upcoming exam${upcomingExams.length !== 1 ? 's' : ''}. Keep preparing consistently!`,
      time: '8:00 PM',
      icon: <BarChart2 size={16} color={textSecondary} strokeWidth={1.5} />,
      read: true,
    },
    {
      id: 'study-1',
      type: 'reminder',
      title: 'Study Reminder',
      body: 'You have not logged any study session today. Stay consistent with your preparation.',
      time: '4:00 PM',
      icon: <BookOpen size={16} color={textSecondary} strokeWidth={1.5} />,
      read: true,
    },
    {
      id: 'alert-1',
      type: 'alert',
      title: 'High Priority Exams This Week',
      body: `${exams.filter((e) => e.priority === 'critical' || e.priority === 'high').length} high priority exam${exams.filter((e) => e.priority === 'critical' || e.priority === 'high').length !== 1 ? 's' : ''} coming up. Make sure you're prepared.`,
      time: 'Yesterday',
      icon: <AlertTriangle size={16} color={textSecondary} strokeWidth={1.5} />,
      read: true,
    },
  ];

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  return (
    <div style={{ width: '100%', height: '100%', background: bg, overflow: 'hidden' }}>
      <div className="page-scroll" style={{ height: '100%', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '56px 24px 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: textPrimary, letterSpacing: -0.7 }}>
                Notifications
              </h1>
              {unread.length > 0 && (
                <p style={{ margin: '4px 0 0', fontSize: 13, color: textSecondary, fontWeight: 300 }}>
                  {unread.length} unread notification{unread.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: metaBg,
              border: `1px solid ${border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Bell size={18} color={textPrimary} strokeWidth={1.5} />
            </div>
          </motion.div>
        </div>

        {/* Notifications */}
        <div style={{ padding: '0 24px' }}>
          {/* Unread */}
          {unread.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: textSecondary, letterSpacing: 0.5, marginBottom: 10 }}>
                NEW
              </div>
              <div style={{
                borderRadius: 20,
                background: cardBg,
                border: `1px solid ${border}`,
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                overflow: 'hidden',
                marginBottom: 20,
              }}>
                {unread.map((notif, i) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                      borderBottom: i < unread.length - 1 ? `1px solid ${border}` : 'none',
                      background: unreadBg,
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative',
                    }}>
                      {notif.icon}
                      <div style={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: dot,
                        border: `1.5px solid ${bg}`,
                      }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{notif.title}</div>
                        <div style={{ fontSize: 11, color: textSecondary, flexShrink: 0, marginLeft: 8 }}>{notif.time}</div>
                      </div>
                      <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.5, fontWeight: 300 }}>{notif.body}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Read */}
          {read.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: textSecondary, letterSpacing: 0.5, marginBottom: 10 }}>
                EARLIER
              </div>
              <div style={{
                borderRadius: 20,
                background: cardBg,
                border: `1px solid ${border}`,
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                overflow: 'hidden',
              }}>
                {read.map((notif, i) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                      borderBottom: i < read.length - 1 ? `1px solid ${border}` : 'none',
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: metaBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      opacity: 0.7,
                    }}>
                      {notif.icon}
                    </div>
                    <div style={{ flex: 1, opacity: 0.8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: textPrimary }}>{notif.title}</div>
                        <div style={{ fontSize: 11, color: textSecondary, flexShrink: 0, marginLeft: 8 }}>{notif.time}</div>
                      </div>
                      <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.5, fontWeight: 300 }}>{notif.body}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Notification settings */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ marginTop: 24 }}
          >
            <div style={{
              padding: '20px',
              borderRadius: 20,
              background: cardBg,
              border: `1px solid ${border}`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 16 }}>
                Notification Preferences
              </div>
              {[
                { label: 'Exam Reminders', desc: '1 day and 1 hour before', enabled: true },
                { label: 'Daily Summary', desc: 'Every evening at 8:00 PM', enabled: true },
                { label: 'Study Reminders', desc: 'Gentle daily nudges', enabled: false },
                { label: 'Missed Exam Alerts', desc: 'When an exam passes', enabled: true },
              ].map((pref, i) => (
                <div
                  key={pref.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderTop: i > 0 ? `1px solid ${border}` : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: textPrimary }}>{pref.label}</div>
                    <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>{pref.desc}</div>
                  </div>
                  <div style={{
                    width: 44,
                    height: 26,
                    borderRadius: 13,
                    background: pref.enabled ? (isDark ? '#ffffff' : '#000000') : (isDark ? '#333333' : '#e5e5e5'),
                    position: 'relative',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'background 0.25s',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 3,
                      left: pref.enabled ? 21 : 3,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: pref.enabled ? (isDark ? '#000000' : '#ffffff') : (isDark ? '#666666' : '#aaaaaa'),
                      transition: 'left 0.25s',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
