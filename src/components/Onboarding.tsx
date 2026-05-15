import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, BookOpen, Bell, BarChart2, Target } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const slides = [
  {
    id: 0,
    heading: 'Organize Every Exam',
    subtext: 'Track school and tuition exams in one calm, distraction-free workspace.',
    icon: <BookOpen size={48} strokeWidth={1} />,
    visual: 'organize',
  },
  {
    id: 1,
    heading: 'See Everything at a Glance',
    subtext: 'Upcoming exams, countdowns, and live statistics — all in one view.',
    icon: <BarChart2 size={48} strokeWidth={1} />,
    visual: 'dashboard',
  },
  {
    id: 2,
    heading: 'Never Forget Another Exam',
    subtext: 'Smart, timely reminders keep you always prepared and never surprised.',
    icon: <Bell size={48} strokeWidth={1} />,
    visual: 'reminders',
  },
  {
    id: 3,
    heading: 'Prepare Chapter by Chapter',
    subtext: 'Track chapters, question patterns, and build your readiness systematically.',
    icon: <Target size={48} strokeWidth={1} />,
    visual: 'chapters',
  },
];

interface VisualProps {
  type: string;
  theme: 'light' | 'dark';
}

const SlideVisual: React.FC<VisualProps> = ({ type, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'rgba(28,28,30,0.8)' : 'rgba(255,255,255,0.8)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const accentBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  if (type === 'organize') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          className="animate-float"
          style={{ width: 280 }}
        >
          {['Physics · School', 'Chemistry · Tuition', 'Biology · Practice'].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 + 0.3 }}
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: '14px 18px',
                marginBottom: 10,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: textPrimary }}>{text.split('·')[0].trim()}</div>
                <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>{text.split('·')[1].trim()}</div>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i === 0 ? textPrimary : i === 1 ? textSecondary : accentBg,
                border: `1px solid ${border}`,
              }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div className="animate-float" style={{ width: 280 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 10,
            }}
          >
            {[
              { label: 'Upcoming', value: '4' },
              { label: 'This Week', value: '2' },
              { label: 'Avg. Marks', value: '86%' },
              { label: 'Subjects', value: '12' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                style={{
                  background: cardBg,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  padding: '12px 14px',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 600, color: textPrimary }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: textSecondary, marginTop: 2 }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              background: cardBg,
              border: `1px solid ${border}`,
              borderRadius: 16,
              padding: '14px 16px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ fontSize: 11, color: textSecondary, marginBottom: 8 }}>Next Exam — in 1 day</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: textPrimary }}>Biology</div>
            <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>School · 2 chapters</div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (type === 'reminders') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div className="animate-float" style={{ width: 280 }}>
          {[
            { title: 'Tomorrow: Physics Exam', time: '9:00 AM', icon: '📚' },
            { title: 'Exam in 1 hour: Chemistry', time: 'Now', icon: '⏰' },
            { title: 'Daily Summary', time: '8:00 PM', icon: '📊' },
          ].map((notif, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 + 0.3 }}
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: '14px 16px',
                marginBottom: 10,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 22 }}>{notif.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: textPrimary }}>{notif.title}</div>
                <div style={{ fontSize: 11, color: textSecondary, marginTop: 2 }}>{notif.time}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  if (type === 'chapters') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div className="animate-float" style={{ width: 280 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: cardBg,
              border: `1px solid ${border}`,
              borderRadius: 16,
              padding: '16px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 12 }}>Physics — Chapters</div>
            {[
              { name: 'Physical World', done: true },
              { name: 'Units & Measurement', done: true },
              { name: 'Motion in a Straight Line', done: false },
              { name: 'Laws of Motion', done: false },
            ].map((ch, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '7px 0',
                  borderBottom: i < 3 ? `1px solid ${border}` : 'none',
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: ch.done ? textPrimary : 'transparent',
                  border: `1.5px solid ${ch.done ? textPrimary : textSecondary}`,
                  flexShrink: 0,
                }} />
                <div style={{ fontSize: 12, color: ch.done ? textPrimary : textSecondary }}>{ch.name}</div>
              </motion.div>
            ))}
          </motion.div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['MCQ', 'SQ', 'CQ'].map((tag) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                style={{
                  background: accentBg,
                  border: `1px solid ${border}`,
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 500,
                  color: textPrimary,
                }}
              >
                {tag}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

export const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const { completeOnboarding, theme } = useAppStore();
  const isDark = theme === 'dark';

  const bg = isDark ? '#0a0a0a' : '#fafafa';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const dotActive = isDark ? '#ffffff' : '#000000';
  const dotInactive = isDark ? '#333333' : '#e0e0e0';
  const btnBg = isDark ? '#ffffff' : '#000000';
  const btnText = isDark ? '#000000' : '#ffffff';

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide((p) => p + 1);
    } else {
      completeOnboarding();
    }
  };

  const goTo = (i: number) => {
    setDirection(i > currentSlide ? 1 : -1);
    setCurrentSlide(i);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: -dir * 60, opacity: 0 }),
  };

  return (
    <div className="theme-transition" style={{
      width: '100%',
      height: '100%',
      background: bg,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Skip */}
      <div style={{ padding: '52px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: textPrimary }}>T</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: textPrimary, letterSpacing: -0.5 }}>Texam</span>
        </motion.div>
        {currentSlide < slides.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={completeOnboarding}
            style={{ fontSize: 13, color: textSecondary, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
          >
            Skip
          </motion.button>
        )}
      </div>

      {/* Visual area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <SlideVisual type={slides[currentSlide].visual} theme={theme} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom content */}
      <div style={{ padding: '0 28px 52px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide + '-text'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 style={{
              fontSize: 30,
              fontWeight: 700,
              color: textPrimary,
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: -0.8,
              marginBottom: 10,
            }}>
              {slides[currentSlide].heading}
            </h1>
            <p style={{
              fontSize: 15,
              color: textSecondary,
              margin: 0,
              lineHeight: 1.6,
              fontWeight: 300,
              marginBottom: 32,
            }}>
              {slides[currentSlide].subtext}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === currentSlide ? 24 : 6,
                height: 6,
                borderRadius: 3,
                background: i === currentSlide ? dotActive : dotInactive,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ))}
        </div>

        {/* Button */}
        <motion.button
          onClick={goNext}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 16,
            background: btnBg,
            color: btnText,
            border: 'none',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            letterSpacing: -0.2,
          }}
        >
          {currentSlide < slides.length - 1 ? (
            <>Continue <ChevronRight size={18} /></>
          ) : (
            <>Get Started <ChevronRight size={18} /></>
          )}
        </motion.button>
      </div>
    </div>
  );
};
