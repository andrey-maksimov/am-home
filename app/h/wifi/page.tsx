'use client';

import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import Card from '@/components/Card';
import { siteConfig } from '@/config/site';

export default function WiFiPage() {
  const [qrCode, setQrCode] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Generate Wi-Fi QR code
    import('qrcode').then((QRCode) => {
      const wifiString = `WIFI:T:${siteConfig.wifi.security};S:${siteConfig.wifi.ssid};P:${siteConfig.wifi.password};;`;
      QRCode.default.toDataURL(wifiString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).then(setQrCode);
    });
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied!`);
  };

  return (
    <PageShell title="Connect to Wi-Fi">
      <div className="space-y-6">
        {/* QR Code */}
        <Card className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-space-glow">Scan to Connect</h2>
          {qrCode ? (
            <div className="bg-white p-4 rounded-lg inline-block">
              <img src={qrCode} alt="Wi-Fi QR Code" className="w-64 h-64 mx-auto" />
            </div>
          ) : (
            <div className="w-64 h-64 mx-auto bg-white/10 rounded-lg animate-pulse" />
          )}
          <p className="text-gray-400 text-sm mt-4">
            📱 Open your Camera app and point it at the QR code to join automatically
          </p>
        </Card>

        {/* Network Details */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Network Details</h3>
          
          <div className="space-y-4">
            {/* SSID */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">Network Name (SSID)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={siteConfig.wifi.ssid}
                  readOnly
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
                <button
                  onClick={() => copyToClipboard(siteConfig.wifi.ssid, 'SSID')}
                  className="px-4 py-2 bg-space-purple hover:bg-space-purple/80 rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">Password</label>
              <div className="flex gap-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={siteConfig.wifi.password}
                  readOnly
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <button
                  onClick={() => copyToClipboard(siteConfig.wifi.password, 'Password')}
                  className="px-4 py-2 bg-space-purple hover:bg-space-purple/80 rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Story */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🌐</span>
            Our Community Wi-Fi Project
          </h3>
          <div className="space-y-4 text-gray-300">
            <p>
              We believe in connected communities. That&apos;s why we&apos;ve built and maintain a guest Wi-Fi network 
              that extends coverage across our townhouse and surrounding area.
            </p>
            
            {/* Coverage Map Placeholder */}
            <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20">
              <p className="text-gray-500">📍 Coverage Map</p>
              <p className="text-sm text-gray-600 mt-2">
                Image: coverage-map.png
              </p>
            </div>

            <p>
              Our network infrastructure includes enterprise-grade routers strategically placed to provide 
              seamless connectivity for our guests and neighbors.
            </p>

            {/* Router Photos Placeholder */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20">
                <p className="text-gray-500">📡</p>
                <p className="text-xs text-gray-600 mt-2">router-install-1.jpg</p>
              </div>
              <div className="bg-white/5 rounded-lg p-8 text-center border border-dashed border-white/20">
                <p className="text-gray-500">📡</p>
                <p className="text-xs text-gray-600 mt-2">router-install-2.jpg</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 italic">
              Fast, secure, and free for all our guests. Enjoy! 🚀
            </p>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
