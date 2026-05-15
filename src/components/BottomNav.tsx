import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, BarChart2, Home, Bell, User } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const BottomNav: React.FC = () => {
  const { theme, activeTab, setActiveTab, exams } = useAppStore();
  const isDark = theme === 'dark';

  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#555555' : '#bbbbbb';

  const upcomingCount = exams.filter((e) => e.status === 'upcoming').length;
  const notifCount = 2;

  const navItems = [
    { key: 'exams' as const, icon: BookOpen, label: 'Exams', badge: upcomingCount > 0 ? upcomingCount : undefined },
    { key: 'stats' as const, icon: BarChart2, label: 'Stats' },
    { key: 'home' as const, icon: Home, label: 'Home', isCenter: true },
    { key: 'notifications' as const, icon: Bell, label: 'Alerts', badge: notifCount > 0 ? notifCount : undefined },
    { key: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0 0 0',
    }}>
      <div
        className={isDark ? 'navbar-glass-dark' : 'navbar-glass-light'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '12px 8px 28px',
          position: 'relative',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <motion.button
                key={item.key}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveTab(item.key)}
                className={isDark ? 'home-btn-dark' : 'home-btn-light'}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -20,
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <motion.div
                  animate={{ rotate: isActive ? 360 : 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <Icon
                    size={22}
                    color={isDark ? '#000000' : '#ffffff'}
                    strokeWidth={2}
                  />
                </motion.div>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.key}
              whileTap={{ scale: 0.85 }}
              onClick={() => setActiveTab(item.key)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '4px 12px',
                position: 'relative',
                minWidth: 56,
              }}
            >
              <div style={{ position: 'relative' }}>
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon
                    size={20}
                    color={isActive ? textPrimary : textSecondary}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                </motion.div>

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -6,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: textPrimary,
                      color: isDark ? '#000000' : '#ffffff',
                      fontSize: 9,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${isDark ? '#0a0a0a' : '#fafafa'}`,
                    }}
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </motion.div>
                )}
              </div>

              {/* Active dot indicator */}
              <motion.div
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: textPrimary,
                }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
