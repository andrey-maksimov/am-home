import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Welcome | Maksimov Townhouse',
  description: 'Private townhouse homepage',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>
        <div className="starfield" />
        {children}
      </body>
    </html>
  );
}
