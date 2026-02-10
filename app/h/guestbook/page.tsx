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
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string } | null>(null);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/guestbook/list?t=' + Date.now(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setEntries(data);
      }
    } catch (err) {
      console.error('Failed to fetch entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    
    // Refresh every 5 seconds
    const interval = setInterval(fetchEntries, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <PageShell title="Digital guestbook">
      <div className="space-y-6">
        <p className="text-gray-400 text-center">
          Messages and memories from our guests.
        </p>
        
        {/* Photo Lightbox Modal */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
              >
                ✕ Close
              </button>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="w-full h-auto rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <p className="text-white text-center mt-4">{selectedPhoto.name}</p>
            </div>
          </div>
        )}

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
        ) : entries.length === 0 ? (
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
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <div className="flex items-start gap-4">
                  {entry.photo_url ? (
                    <div className="relative group">
                      <img
                        src={entry.photo_url}
                        alt={entry.name}
                        className="w-12 h-12 rounded-full object-cover cursor-pointer transition-transform hover:scale-110"
                        onClick={() => setSelectedPhoto({ url: entry.photo_url!, name: entry.name })}
                      />
                      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs pointer-events-none">
                        Click
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-space-purple to-space-blue flex items-center justify-center text-xl font-bold">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-semibold text-white">{entry.name}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })} at {new Date(entry.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-2">{entry.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

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
