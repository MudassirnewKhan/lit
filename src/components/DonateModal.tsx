'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Heart } from 'lucide-react';

export default function DonateModal({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className={`${isMobile ? 'w-full' : ''} bg-green-600 hover:bg-green-700 text-white font-bold gap-2`}
        >
          <Heart className="h-4 w-4 fill-white" /> Donate Now
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md text-center bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-green-800">
            Support Our Scholars
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Scan with any UPI app (GPay, PhonePe, Paytm)
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          {/* QR CODE CONTAINER */}
          <div className="relative w-64 h-64 border-4 border-green-600 rounded-xl overflow-hidden shadow-lg p-2 bg-white">
            <Image 
              src="/qr.jpg" 
              alt="Donate QR Code"
              fill
              className="object-contain"
            />
          </div>

          <div className="bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
            UPI ID: lit-scholarship@upi
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}