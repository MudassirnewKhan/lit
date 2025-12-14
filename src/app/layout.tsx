import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers";
import Navbar from "@/components/header"; 
import Footer from "@/components/footer"; 
import { Toaster } from 'react-hot-toast';
// 1. IMPORT THE SYNC COMPONENT
import SessionSync from "@/components/SessionSync";

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
          
          {/* 2. ADD COMPONENT HERE (Inside AuthProvider) */}
          <SessionSync />

          <div className="flex flex-col min-h-screen">
            <Navbar /> 
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        </AuthProvider>
      </body>
    </html>
  );
}