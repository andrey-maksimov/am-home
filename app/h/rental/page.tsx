import PageShell from '@/components/PageShell';
import Card from '@/components/Card';
import LinkButton from '@/components/LinkButton';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Rental Property | Maksimov Townhouse',
};

export default function RentalPage() {
  return (
    <PageShell title="Our rental property">
      <div className="space-y-6">
        <p className="text-gray-400 text-center">
          We have a beautiful property available for short and long-term stays 🏡
        </p>

        {/* Hero Image */}
        <div className="bg-white/5 rounded-lg p-16 text-center border border-dashed border-white/20">
          <p className="text-gray-500 text-4xl mb-2">🏠</p>
          <p className="text-sm text-gray-600">
            Image: rental-hero.jpg<br />
            <span className="text-xs">(Main property photo)</span>
          </p>
        </div>

        {/* Property Details */}
        <Card>
          <h3 className="text-xl font-semibold mb-4 text-space-glow">Property Highlights</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-xl">🛏️</span>
              <div>
                <strong>Bedrooms:</strong> [Number] spacious bedrooms
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">🚿</span>
              <div>
                <strong>Bathrooms:</strong> [Number] modern bathrooms
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <strong>Location:</strong> [Neighborhood], Dubai
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl">✨</span>
              <div>
                <strong>Amenities:</strong> [List key amenities: pool, gym, parking, etc.]
              </div>
            </li>
          </ul>
        </Card>

        {/* Photo Gallery */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-space-glow">Property Photos</h3>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20 aspect-video flex items-center justify-center">
                <div>
                  <p className="text-gray-500 text-2xl">🏡</p>
                  <p className="text-xs text-gray-600 mt-2">rental-{i}.jpg</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Description */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-space-glow">About the Property</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              [Add detailed property description here. Include information about the space, 
              what makes it special, nearby attractions, transportation options, etc.]
            </p>
            <p>
              Perfect for families, business travelers, or anyone looking for a comfortable 
              home away from home in Dubai.
            </p>
          </div>
        </Card>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <LinkButton href={siteConfig.rental.listingUrl} external icon="🔗">
            View Full Listing
          </LinkButton>
          
          <LinkButton href={siteConfig.rental.bookingUrl} external icon="📅" variant="secondary">
            Check Availability & Book
          </LinkButton>
        </div>

        <Card className="bg-space-purple/10 border-space-purple/30">
          <p className="text-center text-sm text-gray-300">
            💬 Questions? Feel free to reach out via our <a href="/h/contact" className="text-space-glow hover:underline">contact page</a>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
