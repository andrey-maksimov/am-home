'use client';

import { useState, useEffect, useRef } from 'react';
import PageShell from '@/components/PageShell';
import Card from '@/components/Card';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
  photo_url?: string;
}

export default function LeaveMessagePage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    // Fetch latest guestbook entries
    fetch('/api/guestbook/list?limit=5')
      .then(res => res.json())
      .then(data => setEntries(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch entries:', err))
      .finally(() => setLoading(false));
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({ type: 'error', message: 'Photo must be less than 5MB.' });
        return;
      }
      
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.message.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData for multipart upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('phone', formData.phone);
      submitData.append('message', formData.message);
      if (photoFile) {
        submitData.append('photo', photoFile);
      }

      const response = await fetch('/api/guestbook/submit', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Thank you for your message. It will be reviewed before publishing.' 
        });
        setFormData({ name: '', phone: '', message: '' });
        removePhoto();
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to submit message.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell title="Leave a message">
      <div className="space-y-6">
        {/* Form */}
        <Card>
          <h3 className="text-xl font-semibold mb-4 text-space-glow">Share your thoughts</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Your name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-space-blue focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone number (optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-space-blue focus:outline-none"
                placeholder="+971 XX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Your message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white resize-none focus:border-space-blue focus:outline-none"
                placeholder="Share your experience, feedback, or just say hello..."
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Add a photo (optional)</label>
              
              {!photoPreview ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="block border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-space-blue transition-colors"
                  >
                    <p className="text-gray-400">Tap to take a selfie or upload a photo</p>
                    <p className="text-xs text-gray-600 mt-2">Max 5MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-space-purple to-space-blue text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit message'}
            </button>
          </form>

          {submitStatus && (
            <div className={`mt-4 p-4 rounded-lg border ${
              submitStatus.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-200' 
                : 'bg-red-500/10 border-red-500/30 text-red-200'
            }`}>
              <p className="text-sm text-center">{submitStatus.message}</p>
            </div>
          )}
        </Card>

        {/* Recent Messages */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-space-glow">Recent messages</h3>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-3/4"></div>
                </Card>
              ))}
            </div>
          ) : entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map((entry) => (
                <Card key={entry.id}>
                  <div className="flex items-start gap-3">
                    {entry.photo_url ? (
                      <img
                        src={entry.photo_url}
                        alt={entry.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-space-purple to-space-blue flex items-center justify-center text-xl">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-white">{entry.name}</p>
                      <p className="text-sm text-gray-400 mt-1">{entry.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-gray-400 text-center">No messages yet. Be the first to leave one.</p>
            </Card>
          )}
        </div>

        <div className="text-center">
          <a href="/h/guestbook" className="text-space-glow hover:underline text-sm">
            View all messages
          </a>
        </div>
      </div>
    </PageShell>
  );
}
