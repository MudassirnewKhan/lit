// File Path: components/ui/DesktopNav.tsx

'use client'; // This is a Client Component for handling hover state

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NavAuth from './NavAuth'; // The Server Component for auth buttons

// Define the type for our navigation links for TypeScript
type NavLink = {
  label: string;
  href?: string;
  subLinks?: { href: string; label: string }[];
};

// This component receives the navigation links as a prop
export default function DesktopNav({ navLinks }: { navLinks: NavLink[] }) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden md:flex items-center gap-2">
      {navLinks.map((link) =>
        link.subLinks ? (
          <div
            key={link.label}
            onMouseEnter={() => setOpenDropdown(link.label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <DropdownMenu open={openDropdown === link.label}>
              <DropdownMenuTrigger asChild>
                {/* The main link for the dropdown can be a button */}
                <Link href={link.subLinks[0].href.split('#')[0]} passHref>
                   <Button variant="ghost">{link.label}</Button>
                </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent onMouseLeave={() => setOpenDropdown(null)}>
                {link.subLinks.map((subLink) => (
                  <Link key={subLink.href} href={subLink.href} passHref>
                    <DropdownMenuItem>{subLink.label}</DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link key={link.href} href={link.href!} passHref>
            <Button variant="ghost">{link.label}</Button>
          </Link>
        )
      )}
      
      {/* This is where the dynamic Login/Dashboard buttons will appear */}
      <NavAuth />
    </nav>
  );
}