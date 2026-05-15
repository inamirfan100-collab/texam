import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { Onboarding } from './components/Onboarding';
import { ProfileSetup } from './components/ProfileSetup';
import { Dashboard } from './pages/Dashboard';
import { SplashScreen } from './components/SplashScreen';

// Mobile frame wrapper for desktop viewing
const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDesktop = window.innerWidth > 500;
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDesktop ? '#050505' : '#0a0a0a',
      overflow: 'hidden',
    }}>
      {isDesktop && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.03) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
      )}
      <div style={{
        width: '100%',
        maxWidth: 430,
        height: '100%',
        maxHeight: isDesktop ? 932 : '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: isDesktop ? 44 : 0,
        boxShadow: isDesktop
          ? '0 60px 160px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07), 0 0 80px rgba(255,255,255,0.02)'
          : 'none',
      }}>
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { screen, theme } = useAppStore();
  const [splashDone, setSplashDone] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.style.background = theme === 'dark' ? '#0a0a0a' : '#ffffff';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const screenVariants = {
    initial: { opacity: 0, scale: 0.97, y: 12 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.01, y: -8 },
  };

  const renderScreen = () => {
    switch (screen) {
      case 'onboarding':
        return (
          <motion.div
            key="onboarding"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Onboarding />
          </motion.div>
        );
      case 'profile-setup':
        return (
          <motion.div
            key="profile-setup"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <ProfileSetup />
          </motion.div>
        );
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Dashboard />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <MobileFrame>
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {/* Splash screen */}
        {!splashDone && (
          <SplashScreen onComplete={() => setSplashDone(true)} />
        )}

        {/* Main app */}
        <AnimatePresence mode="wait">
          {splashDone && renderScreen()}
        </AnimatePresence>
      </div>
    </MobileFrame>
  );
};

export default App;
