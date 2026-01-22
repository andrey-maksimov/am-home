import PageShell from '@/components/PageShell';
import Card from '@/components/Card';

export const metadata = {
  title: 'QR Code Story | Maksimov Townhouse',
};

export default function QRStoryPage() {
  return (
    <PageShell title="The ceramic QR code story">
      <div className="space-y-6">
        <Card>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg">
              What you just scanned isn&apos;t your typical printed QR code—it&apos;s a handcrafted piece of ceramic art! 🎨
            </p>

            {/* Main QR Photo */}
            <div className="bg-white/5 rounded-lg p-12 text-center border border-dashed border-white/20">
              <p className="text-gray-500 text-4xl mb-2">📷</p>
              <p className="text-sm text-gray-600">
                Image: qr-photo.jpg<br />
                <span className="text-xs">(Ceramic QR code in natural setting)</span>
              </p>
            </div>

            <h3 className="text-xl font-semibold text-space-glow mt-6">The Making</h3>
            <p>
              We created this unique QR code at a local pottery studio in Dubai. The process involved:
            </p>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Designing the QR pattern to be pottery-friendly</li>
              <li>Hand-glazing each square for contrast</li>
              <li>Multiple firings to achieve the perfect finish</li>
              <li>Testing to ensure it actually scans! ✅</li>
            </ul>

            {/* Process Photos */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20">
                <p className="text-gray-500">🎨</p>
                <p className="text-xs text-gray-600 mt-2">pottery-process-1.jpg</p>
              </div>
              <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20">
                <p className="text-gray-500">🔥</p>
                <p className="text-xs text-gray-600 mt-2">pottery-process-2.jpg</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-space-glow mt-6">Why?</h3>
            <p>
              We wanted to create something that blends technology with traditional craftsmanship—a conversation 
              starter that welcomes our guests in a memorable way. It&apos;s not just functional; it&apos;s art that 
              connects the physical and digital worlds.
            </p>

            <p className="text-sm text-gray-400 italic mt-6">
              Plus, it&apos;s probably one of the most unique QR codes you&apos;ll ever scan! 🌟
            </p>
          </div>
        </Card>

        <Card className="bg-space-purple/10 border-space-purple/30">
          <p className="text-center text-gray-300">
            💡 <strong>Fun fact:</strong> This QR code has been scanned by visitors from over 15 countries!
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
