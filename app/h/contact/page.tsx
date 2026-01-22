'use client';

import { useState } from 'react';
import PageShell from '@/components/PageShell';
import Card from '@/components/Card';
import { siteConfig } from '@/config/site';
import Image from 'next/image';

interface ContactCardProps {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
  telegram: string;
  linkedin: string;
  photoSrc?: string;
}

function ContactCard({ name, phone, email, whatsapp, telegram, linkedin, photoSrc }: ContactCardProps) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [emailRevealed, setEmailRevealed] = useState(false);

  return (
    <Card>
      <div className="flex flex-col items-center mb-6">
        {photoSrc && (
          <div className="mb-4 relative w-32 h-32 rounded-full overflow-hidden border-4 border-space-glow/30">
            <Image
              src={photoSrc}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h3 className="text-xl font-semibold text-space-glow">{name}</h3>
      </div>
      
      <div className="space-y-3">
        {/* Phone - Tap to reveal and call */}
        <div className="border border-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Phone</p>
              {phoneRevealed ? (
                <a 
                  href={`tel:${phone}`} 
                  className="text-white hover:text-space-glow transition-colors font-medium"
                >
                  {phone}
                </a>
              ) : (
                <button
                  onClick={() => setPhoneRevealed(true)}
                  className="text-space-glow hover:text-space-purple transition-colors text-sm font-medium"
                >
                  Tap to reveal →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Email - Tap to reveal */}
        <div className="border border-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📧</span>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Email</p>
              {emailRevealed ? (
                <a 
                  href={`mailto:${email}`} 
                  className="text-white hover:text-space-glow transition-colors font-medium break-all"
                >
                  {email}
                </a>
              ) : (
                <button
                  onClick={() => setEmailRevealed(true)}
                  className="text-space-glow hover:text-space-purple transition-colors text-sm font-medium"
                >
                  Tap to reveal →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors border border-green-600/30"
        >
          <span className="text-2xl">💬</span>
          <div className="flex-1">
            <p className="text-sm text-gray-300">Message on WhatsApp</p>
          </div>
          <span className="text-gray-400">→</span>
        </a>

        {/* Telegram */}
        <a
          href={telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors border border-blue-600/30"
        >
          <span className="text-2xl">✈️</span>
          <div className="flex-1">
            <p className="text-sm text-gray-300">Message on Telegram</p>
          </div>
          <span className="text-gray-400">→</span>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-blue-700/20 hover:bg-blue-700/30 rounded-lg transition-colors border border-blue-700/30"
        >
          <span className="text-2xl">💼</span>
          <div className="flex-1">
            <p className="text-sm text-gray-300">Connect on LinkedIn</p>
          </div>
          <span className="text-gray-400">→</span>
        </a>
      </div>
    </Card>
  );
}

export default function ContactPage() {
  return (
    <PageShell title="Our contact details">
      <div className="space-y-6">
        <p className="text-gray-400 text-center mb-8">
          Feel free to reach out to us anytime. We&apos;d love to hear from you! 💫
        </p>

        <ContactCard
          name={siteConfig.contacts.andrey.name}
          phone={siteConfig.contacts.andrey.phone}
          email={siteConfig.contacts.andrey.email}
          whatsapp={siteConfig.contacts.andrey.whatsapp}
          telegram={siteConfig.contacts.andrey.telegram}
          linkedin={siteConfig.contacts.andrey.linkedin}
          photoSrc="/andrey.jpg"
        />

        <ContactCard
          name={siteConfig.contacts.wife.name}
          phone={siteConfig.contacts.wife.phone}
          email={siteConfig.contacts.wife.email}
          whatsapp={siteConfig.contacts.wife.whatsapp}
          telegram={siteConfig.contacts.wife.telegram}
          linkedin={siteConfig.contacts.wife.linkedin}
          photoSrc="/evgeniya.jpg"
        />

        <Card className="bg-gradient-to-r from-space-purple/20 to-space-blue/20 border-space-purple/30">
          <p className="text-center text-sm text-gray-300">
            ⏰ We typically respond within a few hours during UAE business hours
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
