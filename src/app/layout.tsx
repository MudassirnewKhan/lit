import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers";
import Navbar from "@/components/header"; 
import Footer from "@/components/footer"; 
// --- FIX 1: Import Toaster ---
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LIT Scholarship Portal",
  description: "Lead, Ignite, Transform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar /> 
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          {/* --- FIX 2: Add Toaster here --- */}
          <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        </AuthProvider>
      </body>
    </html>
  );
}