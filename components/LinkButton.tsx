import Link from 'next/link';
import { ReactNode } from 'react';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
  disabled?: boolean;
}

export default function LinkButton({ 
  href, 
  children, 
  icon, 
  variant = 'primary',
  external = false,
  disabled = false
}: LinkButtonProps) {
  const baseClasses = "block w-full px-6 py-4 rounded-xl font-medium text-center transition-all duration-300";
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-r from-space-purple to-space-blue text-white"
    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm";
  
  const disabledClasses = disabled
    ? "opacity-40 cursor-not-allowed"
    : "glow-button";
  
  const classes = `${baseClasses} ${variantClasses} ${disabledClasses}`;
  
  const content = (
    <span className="flex items-center justify-center gap-3">
      {icon && <span className="text-xl">{icon}</span>}
      <span className="flex items-center gap-2">
        {children}
        {disabled && <span className="text-xs opacity-60">(Coming soon)</span>}
      </span>
    </span>
  );
  
  if (disabled) {
    return (
      <div className={classes}>
        {content}
      </div>
    );
  }
  
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }
  
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
