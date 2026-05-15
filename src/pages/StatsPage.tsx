import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { TrendingUp, Award, Target, Activity } from 'lucide-react';

export const StatsPage: React.FC = () => {
  const { theme, exams, profile } = useAppStore();
  const isDark = theme === 'dark';

  const bg = isDark ? '#0a0a0a' : '#f5f5f7';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const cardBg = isDark ? 'rgba(22,22,24,0.9)' : 'rgba(255,255,255,0.9)';
  const border = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const metaBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const chartColor = isDark ? '#ffffff' : '#000000';
  const chartColorLight = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
  const chartColorMid = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';

  const completedExams = exams.filter((e) => e.status === 'completed' && e.obtainedMarks !== undefined);
  const upcomingExams = exams.filter((e) => e.status === 'upcoming');

  // Subject performance
  const subjectPerformance = profile?.subjects.map((sub) => {
    const subExams = completedExams.filter((e) => e.subjectId === sub.id || e.subject === sub.name);
    if (subExams.length === 0) return null;
    const avg = Math.round(subExams.reduce((acc, e) => acc + ((e.obtainedMarks || 0) / e.fullMarks) * 100, 0) / subExams.length);
    return { name: sub.name.split(' ')[0], avg, exams: subExams.length };
  }).filter(Boolean) || [];

  // Monthly data
  const monthlyData = (() => {
    const months: Record<string, { month: string; exams: number; avgScore: number; scores: number[] }> = {};
    completedExams.forEach((e) => {
      const date = new Date(e.date);
      const key = date.toLocaleDateString('en-US', { month: 'short' });
      if (!months[key]) months[key] = { month: key, exams: 0, avgScore: 0, scores: [] };
      months[key].exams++;
      months[key].scores.push(((e.obtainedMarks || 0) / e.fullMarks) * 100);
    });
    return Object.values(months).map((m) => ({
      ...m,
      avgScore: m.scores.length > 0 ? Math.round(m.scores.reduce((a, b) => a + b, 0) / m.scores.length) : 0,
    }));
  })();

  const avgMarks = completedExams.length > 0
    ? Math.round(completedExams.reduce((acc, e) => acc + ((e.obtainedMarks || 0) / e.fullMarks) * 100, 0) / completedExams.length)
    : 0;

  const bestSubject = subjectPerformance.length > 0
    ? subjectPerformance.reduce((a, b) => (a!.avg > b!.avg ? a : b))
    : null;

  const weakestSubject = subjectPerformance.length > 0
    ? subjectPerformance.reduce((a, b) => (a!.avg < b!.avg ? a : b))
    : null;

  const completionRate = exams.length > 0
    ? Math.round((completedExams.length / exams.length) * 100)
    : 0;

  // Heatmap data (last 30 days)
  const heatmapData = (() => {
    const days: { date: string; count: number; hasExam: boolean }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasExam = exams.some((e) => e.date === dateStr);
      days.push({ date: dateStr, count: hasExam ? 1 : 0, hasExam });
    }
    return days;
  })();

  const priorityDistribution = [
    { name: 'Critical', value: exams.filter((e) => e.priority === 'critical').length, color: chartColor },
    { name: 'High', value: exams.filter((e) => e.priority === 'high').length, color: chartColorMid },
    { name: 'Medium', value: exams.filter((e) => e.priority === 'medium').length, color: chartColorLight },
    { name: 'Low', value: exams.filter((e) => e.priority === 'low').length, color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
  ].filter((d) => d.value > 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          padding: '8px 12px',
          borderRadius: 10,
          background: isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)',
          border: `1px solid ${border}`,
          backdropFilter: 'blur(20px)',
          fontSize: 12,
          color: textPrimary,
          fontWeight: 600,
        }}>
          {payload[0].value}%
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '100%', background: bg, overflow: 'hidden' }}>
      <div className="page-scroll" style={{ height: '100%', paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ padding: '56px 24px 20px' }}>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ margin: 0, fontSize: 28, fontWeight: 700, color: textPrimary, letterSpacing: -0.7 }}
          >
            Analytics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ margin: '6px 0 0', fontSize: 14, color: textSecondary, fontWeight: 300 }}
          >
            Your academic performance overview
          </motion.p>
        </div>

        {/* Key Stats */}
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            {[
              { icon: TrendingUp, label: 'Average Score', value: avgMarks > 0 ? `${avgMarks}%` : '—', delay: 0.05 },
              { icon: Activity, label: 'Completion Rate', value: `${completionRate}%`, delay: 0.1 },
              { icon: Award, label: 'Best Subject', value: bestSubject?.name || '—', delay: 0.15 },
              { icon: Target, label: 'Total Exams', value: exams.length, delay: 0.2 },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
                style={{
                  padding: '18px 16px',
                  borderRadius: 18,
                  background: cardBg,
                  border: `1px solid ${border}`,
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                }}
              >
                <stat.icon size={16} color={textSecondary} strokeWidth={1.5} style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 22, fontWeight: 700, color: textPrimary, letterSpacing: -0.5, marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: textSecondary, fontWeight: 400 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        {monthlyData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ padding: '0 24px 24px' }}
          >
            <div style={{
              padding: '20px',
              borderRadius: 20,
              background: cardBg,
              border: `1px solid ${border}`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>Score Trend</div>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 20, fontWeight: 300 }}>Average marks by month</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={border} />
                  <XAxis dataKey="month" tick={{ fill: textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke={chartColor}
                    strokeWidth={2}
                    dot={{ fill: chartColor, r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: chartColor }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Subject Performance */}
        {subjectPerformance.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ padding: '0 24px 24px' }}
          >
            <div style={{
              padding: '20px',
              borderRadius: 20,
              background: cardBg,
              border: `1px solid ${border}`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>Subject Performance</div>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 20, fontWeight: 300 }}>Average score per subject</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={subjectPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={border} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avg" fill={chartColor} radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Best & Weakest */}
        {(bestSubject || weakestSubject) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
          >
            {bestSubject && (
              <div style={{
                padding: '18px 16px',
                borderRadius: 18,
                background: cardBg,
                border: `1px solid ${border}`,
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🏆</div>
                <div style={{ fontSize: 11, color: textSecondary, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>STRONGEST</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: textPrimary }}>{bestSubject.name}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: textPrimary, marginTop: 4 }}>{bestSubject.avg}%</div>
              </div>
            )}
            {weakestSubject && weakestSubject.name !== bestSubject?.name && (
              <div style={{
                padding: '18px 16px',
                borderRadius: 18,
                background: cardBg,
                border: `1px solid ${border}`,
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📈</div>
                <div style={{ fontSize: 11, color: textSecondary, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>NEEDS WORK</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: textPrimary }}>{weakestSubject.name}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: textPrimary, marginTop: 4 }}>{weakestSubject.avg}%</div>
              </div>
            )}
          </motion.div>
        )}

        {/* Priority Distribution */}
        {priorityDistribution.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ padding: '0 24px 24px' }}
          >
            <div style={{
              padding: '20px',
              borderRadius: 20,
              background: cardBg,
              border: `1px solid ${border}`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>Priority Mix</div>
                <div style={{ fontSize: 12, color: textSecondary, marginBottom: 12, fontWeight: 300 }}>Exam distribution</div>
                {priorityDistribution.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: textSecondary }}>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <PieChart width={120} height={120}>
                  <Pie
                    data={priorityDistribution}
                    cx={60}
                    cy={60}
                    innerRadius={35}
                    outerRadius={55}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
            </div>
          </motion.div>
        )}

        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ padding: '0 24px 24px' }}
        >
          <div style={{
            padding: '20px',
            borderRadius: 20,
            background: cardBg,
            border: `1px solid ${border}`,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>Exam Calendar</div>
            <div style={{ fontSize: 12, color: textSecondary, marginBottom: 16, fontWeight: 300 }}>Last 30 days</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
              {heatmapData.map((day, i) => (
                <div
                  key={i}
                  title={day.date}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 4,
                    background: day.hasExam
                      ? chartColor
                      : metaBg,
                    opacity: day.hasExam ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <span style={{ fontSize: 11, color: textSecondary }}>30 days ago</span>
              <span style={{ fontSize: 11, color: textSecondary }}>Today</span>
            </div>
          </div>
        </motion.div>

        {/* Subject list with performance bars */}
        {subjectPerformance.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ padding: '0 24px 24px' }}
          >
            <div style={{
              padding: '20px',
              borderRadius: 20,
              background: cardBg,
              border: `1px solid ${border}`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 16 }}>Performance by Subject</div>
              {subjectPerformance.map((sub, i) => sub && (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: textPrimary }}>{sub.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>{sub.avg}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: metaBg, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sub.avg}%` }}
                      transition={{ delay: 0.6 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: chartColor, borderRadius: 2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state for no data */}
        {completedExams.length === 0 && upcomingExams.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: textPrimary, marginBottom: 8 }}>No data yet</div>
            <div style={{ fontSize: 13, color: textSecondary }}>Complete your first exam to see analytics</div>
          </div>
        )}
      </div>
    </div>
  );
};
