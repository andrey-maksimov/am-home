import LinkButton from '@/components/LinkButton';
import NoteBanner from '@/components/NoteBanner';
import WarpAnimation from '@/components/WarpAnimation';
import ScanTracker from '@/components/ScanTracker';

export const metadata = {
  title: 'Welcome Home | Maksimov Townhouse',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-static';

export default function TownhouseHomePage() {
  return (
    <>
      <WarpAnimation />
      <ScanTracker />
      
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-space-glow to-space-blue bg-clip-text text-transparent animate-float">
              Welcome, traveler
            </h1>
            <p className="text-gray-400">You&apos;ve discovered our townhouse homepage</p>
          </div>

          {/* Status Banner */}
          <NoteBanner />

          {/* Menu Buttons */}
          <div className="space-y-3">
            {/* Treasure Map - HIDDEN until next birthday
            <a 
              href="/h/treasure"
              className="block w-full px-6 py-4 rounded-xl font-medium text-center transition-all duration-300 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #8B4513 0%, #D4AF37 50%, #8B4513 100%)',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(212, 175, 55, 0.3)',
              }}
            >
              <div className="absolute inset-0 opacity-50 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-shimmer" />
              </div>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-1 h-1 bg-yellow-300 rounded-full top-1/4 left-1/4 animate-float-sparkle" style={{ animationDelay: '0s' }} />
                <div className="absolute w-1 h-1 bg-amber-400 rounded-full top-3/4 left-3/4 animate-float-sparkle" style={{ animationDelay: '0.5s' }} />
                <div className="absolute w-1 h-1 bg-yellow-200 rounded-full top-1/2 right-1/4 animate-float-sparkle" style={{ animationDelay: '1s' }} />
              </div>
              <span className="relative flex items-center justify-center gap-3 text-white font-bold drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl animate-bounce-subtle">🗺️</span>
                <span className="text-shadow-treasure">Treasure Map</span>
                <span className="text-2xl animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>✨</span>
              </span>
            </a>
            */}

            <LinkButton href="/h/wifi">
              Connect to Wi-Fi
            </LinkButton>
            
            <LinkButton href="/h/leave-message">
              Leave a message
            </LinkButton>
            
            <LinkButton href="/h/contact">
              Our contact details
            </LinkButton>
            
            <LinkButton href="/h/guestbook">
              Digital guestbook
            </LinkButton>
            
            <LinkButton href="/h/qr-story" variant="secondary" disabled>
              Learn about this QR code
            </LinkButton>
            
            <LinkButton href="/h/family" variant="secondary" disabled>
              Our family
            </LinkButton>
            
            <LinkButton href="/h/rental" variant="secondary" disabled>
              Rental property
            </LinkButton>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm pt-4">
            Made in Dubai
          </p>
        </div>
      </div>
    </>
  );
}
