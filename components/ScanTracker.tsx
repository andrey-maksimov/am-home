'use client';

import { useEffect } from 'react';

const SCAN_TRACKING_KEY = 'scan-tracked-today';

export default function ScanTracker() {
  useEffect(() => {
    // Check if we've already tracked a scan today
    const lastTracked = localStorage.getItem(SCAN_TRACKING_KEY);
    const now = Date.now();
    const today = new Date().toDateString();
    
    let shouldTrack = false;
    
    if (!lastTracked) {
      // First visit ever
      shouldTrack = true;
    } else {
      try {
        const trackedData = JSON.parse(lastTracked);
        if (trackedData.date !== today) {
          // Different day, track again
          shouldTrack = true;
        }
      } catch {
        // Invalid data, track again
        shouldTrack = true;
      }
    }
    
    if (shouldTrack) {
      // Send scan notification
      fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: '/h',
          timestamp: now,
        }),
      })
        .then(() => {
          // Store tracking info
          localStorage.setItem(
            SCAN_TRACKING_KEY,
            JSON.stringify({ date: today, timestamp: now })
          );
        })
        .catch((err) => {
          console.error('Failed to track scan:', err);
        });
    }
  }, []);

  return null; // This component doesn't render anything
}
