// File Path: components/ui/MobileNav.tsx

'use client'; // This is a Client Component for the interactive sheet and session hook

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';

// Define the types for our navigation links
type NavLink = {
  label: string;
  href?: string;
  subLinks?: { href: string; label: string }[];
};

type LoginLink = {
  label: string;
  subLinks: { href: string; label: string }[];
};

export default function MobileNav({ navLinks, loginLinks }: { navLinks: NavLink[], loginLinks: LoginLink }) {
  // useSession is a client-side hook to get authentication status
  const { data: session } = useSession();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col gap-2 mt-8">
            {navLinks.map((link) =>
              link.subLinks ? (
                <Accordion type="single" collapsible className="w-full" key={link.label}>
                  <AccordionItem value={link.label} className="border-b-0">
                    <AccordionTrigger className="py-2 text-lg font-normal hover:no-underline">
                      {link.label}
                    </AccordionTrigger>
                    <AccordionContent className="pl-6">
                      {link.subLinks.map((subLink) => (
                        <Link key={subLink.href} href={subLink.href} className="block py-2 text-muted-foreground hover:text-foreground">
                          {subLink.label}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link key={link.href} href={link.href!} passHref>
                  <Button variant="ghost" className="w-full justify-start text-lg">{link.label}</Button>
                </Link>
              )
            )}
            
            <div className="border-t pt-4 mt-2 flex flex-col gap-2">
              {/* Conditionally render buttons based on session status */}
              {session ? (
                <>
                  <Link href="/admin/dashboard" passHref>
                    <Button variant="outline" className="w-full">Dashboard</Button>
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/donate" passHref>
                    <Button className="w-full">Donate</Button>
                  </Link>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="login-item" className="border-b-0">
                      <AccordionTrigger className="py-2 text-lg font-normal hover:no-underline">
                        {loginLinks.label}
                      </AccordionTrigger>
                      <AccordionContent className="pl-6">
                        {loginLinks.subLinks.map((subLink) => (
                          <Link key={subLink.href} href={subLink.href} className="block py-2 text-muted-foreground hover:text-foreground">
                            Login {subLink.label}
                          </Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}