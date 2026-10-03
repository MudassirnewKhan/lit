// File Path: src/app/admin/security/mfa/page.tsx
// Lives under /admin so the admin layout + middleware protect it (it used to sit under /api, which skips middleware).
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MfaSetupPage() {
  const [qrCode, setQrCode] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [alreadyEnabled, setAlreadyEnabled] = useState(false);

  // Ask the server for a fresh secret + QR code when the page opens
  useEffect(() => {
    const start = async () => {
      try {
        const res = await fetch('/api/admin/mfa-setup', { method: 'POST' });
        const data = await res.json();
        if (res.status === 409) setAlreadyEnabled(true);
        else if (!res.ok) setError(data.error || 'Could not start setup.');
        else {
          setQrCode(data.qrCodeDataUrl);
          setManualKey(data.manualKey);
        }
      } catch {
        setError('Could not reach the server.');
      } finally {
        setLoading(false);
      }
    };
    start();
  }, []);

  const handleVerify = async () => {
    setError('');
    setVerifying(true);
    try {
      const res = await fetch('/api/admin/mfa-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) setEnabled(true);
      else setError(data.error || 'Verification failed.');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>Adds a 6-digit code from your phone to your admin login.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}

          {alreadyEnabled && <p className="text-green-700">MFA is already enabled on your account.</p>}

          {enabled && (
            <p className="text-green-700">
              MFA is now enabled. From your next login you will be asked for the code.
            </p>
          )}

          {!loading && !alreadyEnabled && !enabled && qrCode && (
            <>
              <p className="text-sm">1. Scan this QR code with Google Authenticator, Authy or similar.</p>
              <Image src={qrCode} alt="MFA QR code" width={200} height={200} unoptimized />
              <p className="text-xs text-muted-foreground break-all">
                Can&apos;t scan? Enter this key manually: <span className="font-mono">{manualKey}</span>
              </p>
              <p className="text-sm">2. Enter the 6-digit code shown in the app.</p>
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                placeholder="123456"
              />
              <Button onClick={handleVerify} disabled={verifying || code.length !== 6}>
                {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify & enable'}
              </Button>
            </>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
