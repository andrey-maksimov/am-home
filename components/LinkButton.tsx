import Link from 'next/link';
import { ReactNode } from 'react';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
}

export default function LinkButton({ 
  href, 
  children, 
  icon, 
  variant = 'primary',
  external = false 
}: LinkButtonProps) {
  const baseClasses = "block w-full px-6 py-4 rounded-xl font-medium text-center transition-all duration-300 glow-button";
  const variantClasses = variant === 'primary' 
    ? "bg-gradient-to-r from-space-purple to-space-blue text-white"
    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm";
  
  const classes = `${baseClasses} ${variantClasses}`;
  
  const content = (
    <span className="flex items-center justify-center gap-3">
      {icon && <span className="text-xl">{icon}</span>}
      <span>{children}</span>
    </span>
  );
  
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
