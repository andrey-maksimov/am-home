'use client';

import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import Card from '@/components/Card';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
  photo_url?: string;
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all guestbook entries with cache busting
    fetch('/api/guestbook/list?t=' + Date.now(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })
      .then(res => res.json())
      .then(data => setEntries(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch entries:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell title="Digital guestbook">
      <div className="space-y-6">
        <p className="text-gray-400 text-center">
          Messages and memories from our guests.
        </p>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-1/4"></div>
                    <div className="h-3 bg-white/10 rounded w-3/4"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <div className="flex items-start gap-4">
                  {/* Avatar or Photo */}
                  {entry.photo_url ? (
                    <img
                      src={entry.photo_url}
                      alt={entry.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-space-purple to-space-blue flex items-center justify-center text-xl font-bold">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-semibold text-white">{entry.name}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-2">{entry.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-400">No entries yet. Be the first to leave a message.</p>
              <a
                href="/h/leave-message"
                className="inline-block mt-4 text-space-glow hover:underline"
              >
                Leave a message
              </a>
            </div>
          </Card>
        )}

        {/* CTA */}
        {entries.length > 0 && (
          <div className="text-center pt-4">
            <a
              href="/h/leave-message"
              className="inline-block px-6 py-3 bg-gradient-to-r from-space-purple to-space-blue rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Leave your message
            </a>
          </div>
        )}
      </div>
    </PageShell>
  );
}
