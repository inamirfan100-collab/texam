import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  isDark: boolean;
  highlight?: boolean;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  subtitle,
  isDark,
  highlight = false,
  delay = 0,
}) => {
  const cardBg = highlight
    ? isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'
    : isDark ? 'rgba(22,22,24,0.9)' : 'rgba(255,255,255,0.9)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const textPrimary = isDark ? '#ffffff' : '#000000';
  const textSecondary = isDark ? '#888888' : '#999999';
  const iconBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: cardBg,
        border: `1px solid ${border}`,
        borderRadius: 18,
        padding: '18px 16px',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.3)'
          : '0 4px 24px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
      }}>
        <Icon size={16} color={textPrimary} strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: textPrimary, letterSpacing: -0.6, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: textPrimary, fontWeight: 500, marginTop: 5 }}>{label}</div>
      {subtitle && (
        <div style={{ fontSize: 11, color: textSecondary, marginTop: 3, fontWeight: 300 }}>{subtitle}</div>
      )}
    </motion.div>
  );
};
