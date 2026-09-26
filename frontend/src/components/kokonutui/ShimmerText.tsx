import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  className?: string;
  shimmerColor?: string;
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({
  text,
  className,
  shimmerColor = '#C5A059',
  ...props
}) => {
  return (
    <span
      className={cn(
        'relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-[#DFD1BA] to-white bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]',
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, currentColor 0%, ${shimmerColor} 50%, currentColor 100%)`,
      }}
      {...props}
    >
      {text}
    </span>
  );
};
