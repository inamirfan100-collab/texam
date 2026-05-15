import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center' }}
          >
            {/* Logo mark */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                backdropFilter: 'blur(20px)',
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', letterSpacing: -2, fontFamily: 'Inter, sans-serif' }}>T</span>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1 style={{
                margin: 0,
                fontSize: 36,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: -1.5,
                fontFamily: 'Inter, sans-serif',
              }}>
                Texam
              </h1>
              <p style={{
                margin: '8px 0 0',
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 300,
                letterSpacing: 0.5,
                fontFamily: 'Inter, sans-serif',
              }}>
                Academic Command Center
              </p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ marginTop: 48 }}
            >
              <div style={{
                width: 32,
                height: 2,
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 1,
                overflow: 'hidden',
                margin: '0 auto',
              }}>
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 0.8, delay: 0.9, ease: 'easeInOut' }}
                  style={{
                    width: '50%',
                    height: '100%',
                    background: 'rgba(255,255,255,0.6)',
                    borderRadius: 1,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
