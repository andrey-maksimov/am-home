'use client';

import { useEffect, useState } from 'react';
import Card from './Card';

export default function NoteBanner() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the status message from Supabase
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message);
        }
      })
      .catch(err => console.error('Failed to fetch status:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="mb-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-3/4"></div>
      </Card>
    );
  }

  if (!message) {
    return null;
  }

  return (
    <Card className="mb-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📝</span>
        <p className="text-gray-300 text-base flex-1">{message}</p>
      </div>
    </Card>
  );
}
