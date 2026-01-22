import Link from 'next/link';
import { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export default function PageShell({ children, title, showBackButton = true }: PageShellProps) {
  return (
    <div className="min-h-screen py-8 px-4 relative">
      <div className="max-w-2xl mx-auto">
        {showBackButton && (
          <Link 
            href="/h" 
            className="inline-flex items-center gap-2 text-space-glow hover:text-white transition-colors mb-6 group"
          >
            <svg 
              className="w-5 h-5 transition-transform group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        )}
        
        {title && (
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-space-glow bg-clip-text text-transparent">
            {title}
          </h1>
        )}
        
        {children}
      </div>
    </div>
  );
}
