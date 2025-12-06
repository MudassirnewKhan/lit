// File Path: app/admin/security/mfa/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function MfaSetupPage() {
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch the QR code when the page loads
  useEffect(() => {
    const fetchQrCode = async () => {
      const response = await fetch('/api/admin/mfa-setup');
      const data = await response.json();
      if (data.qrCodeDataUrl) {
        setQrCode(data.qrCodeDataUrl);
      }
    };
    fetchQrCode();
  }, []);
  
  // This would be another API call to verify the code and finalize setup
  const handleVerify = async () => {
      // POST to an endpoint like /api/admin/mfa-verify with the verificationCode
      // On success, set mfaEnabled = true in the database.
      console.log("Verifying code:", verificationCode);
      setSuccess(true); // Simulate success
  };

  if (success) {
    return <div>MFA has been enabled successfully!</div>;
  }

  return (
    <div>
      <h2>Set Up Multi-Factor Authentication</h2>
      <p>1. Scan this QR code with your authenticator app (e.g., Google Authenticator).</p>
      {qrCode && <Image src={qrCode} alt="MFA QR Code" width={200} height={200} />}
      <p>2. Enter the 6-digit code from your app to verify.</p>
      <input 
        type="text" 
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        maxLength={6}
      />
      <Button onClick={handleVerify}>Verify & Enable</Button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}