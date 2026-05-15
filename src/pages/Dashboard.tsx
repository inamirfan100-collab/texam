import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { BottomNav } from '../components/BottomNav';
import { HomePage } from './HomePage';
import { ExamsPage } from './ExamsPage';
import { StatsPage } from './StatsPage';
import { NotificationsPage } from './NotificationsPage';
import { ProfilePage } from './ProfilePage';

export const Dashboard: React.FC = () => {
  const { activeTab, theme } = useAppStore();
  const isDark = theme === 'dark';

  const bg = isDark ? '#0a0a0a' : '#f5f5f7';

  const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <HomePage key="home" />;
      case 'exams': return <ExamsPage key="exams" />;
      case 'stats': return <StatsPage key="stats" />;
      case 'notifications': return <NotificationsPage key="notifs" />;
      case 'profile': return <ProfilePage key="profile" />;
      default: return <HomePage key="home" />;
    }
  };

  return (
    <div
      className="theme-transition"
      style={{
        width: '100%',
        height: '100%',
        background: bg,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Page content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};
