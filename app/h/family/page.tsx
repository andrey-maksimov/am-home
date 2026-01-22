import PageShell from '@/components/PageShell';
import Card from '@/components/Card';

export const metadata = {
  title: 'Our Family | Maksimov Townhouse',
};

export default function FamilyPage() {
  return (
    <PageShell title="Our family">
      <div className="space-y-6">
        <Card>
          <div className="space-y-4 text-gray-300">
            {/* Family Photo */}
            <div className="bg-white/5 rounded-lg p-16 text-center border border-dashed border-white/20">
              <p className="text-gray-500 text-4xl mb-2">👨‍👩‍👧‍👦</p>
              <p className="text-sm text-gray-600">
                Image: family-photo.jpg<br />
                <span className="text-xs">(Main family portrait)</span>
              </p>
            </div>

            <h3 className="text-xl font-semibold text-space-glow mt-6">Welcome to Our Home</h3>
            <p>
              We&apos;re the Maksimov family, and we&apos;ve been calling Dubai home since [year]. Our townhouse 
              is more than just a place to live—it&apos;s where we create memories, host friends, and build 
              community.
            </p>

            <p>
              [Add your family story here: how you met, what brought you to Dubai, what you love about 
              your neighborhood, hobbies, interests, pets, etc.]
            </p>
          </div>
        </Card>

        {/* Photo Gallery */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-space-glow">Moments & Memories</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20 aspect-square flex items-center justify-center">
              <div>
                <p className="text-gray-500 text-2xl">📸</p>
                <p className="text-xs text-gray-600 mt-2">family-1.jpg</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20 aspect-square flex items-center justify-center">
              <div>
                <p className="text-gray-500 text-2xl">📸</p>
                <p className="text-xs text-gray-600 mt-2">family-2.jpg</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20 aspect-square flex items-center justify-center">
              <div>
                <p className="text-gray-500 text-2xl">📸</p>
                <p className="text-xs text-gray-600 mt-2">family-3.jpg</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20 aspect-square flex items-center justify-center">
              <div>
                <p className="text-gray-500 text-2xl">📸</p>
                <p className="text-xs text-gray-600 mt-2">family-4.jpg</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-space-purple/20 to-space-blue/20 border-space-purple/30">
          <p className="text-center text-gray-300">
            ❤️ Thank you for being part of our story!
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
