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
            
            <LinkButton href="/h/qr-story" variant="secondary">
              Learn about this QR code
            </LinkButton>
            
            <LinkButton href="/h/family" variant="secondary">
              Our family
            </LinkButton>
            
            <LinkButton href="/h/rental" variant="secondary">
              View our rental property details
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
