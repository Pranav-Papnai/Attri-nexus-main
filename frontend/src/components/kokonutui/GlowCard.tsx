import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className,
  glowColor = 'rgba(197, 160, 89, 0.35)',
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative group rounded-2xl p-[1px] overflow-hidden transition-all duration-300',
        className
      )}
      {...(props as any)}
    >
      {/* Animated Rotating Gradient Glow Border */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`
        }}
      />
      <div className="relative rounded-2xl bg-white dark:bg-[#0B132B] h-full w-full border border-slate-200/80 dark:border-slate-800 shadow-sm group-hover:shadow-md transition-shadow">
        {children}
      </div>
    </motion.div>
  );
};
