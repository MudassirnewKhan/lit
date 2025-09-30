'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu } from 'lucide-react';

// Updated navigation links to use hash links for single-page sections
const navLinks = [
  { href: '/', label: 'Home' },
  {
    label: 'About',
    subLinks: [
      { href: '/about#foundation', label: 'Foundation of LIT' },
      { href: '/about#mission', label: 'Mission' },
      { href: '/about#members', label: 'Members' },
      { href: '/about#history', label: 'Leadership History' },
      { href: '/about#sponsors', label: 'Sponsors' },
    ],
  },
  {
    label: 'Apply',
    subLinks: [
      { href: '/apply/who', label: 'Who can Apply?' },
      { href: '/apply/apptimeline', label: 'Application Timeline' },
      { href: '/apply/faqs', label: 'FAQs' },
      { href: '/apply/start', label: 'Start your Application' },
    ],
  },
  {
    label: 'Alumni',
    subLinks: [
      { href: '/alumni#testimonials', label: 'Testimonials' },
      { href: '/alumni#awardees', label: 'Awardees' },
      { href: '/alumni#successful-scholars', label: 'Successful Scholars' },
    ],
  },
  { href: '/resources', label: 'Resources' },
  { href: '/policies', label: 'Policies' },
];

const loginLinks = {
  label: 'Login',
  subLinks: [
    { href: '/login/awardee', label: 'as Awardee' },
    { href: '/login/mentor', label: 'as Mentor/Coach' },
    { href: '/login/sponsor', label: 'as Sponsor' },
  ]
};

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="w-full h-16 bg-card sticky top-0 z-50 border-b flex items-center">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-bold text-xl text-primary">
          Lit Scholarship Portal
        </Link>

        {/* Desktop Navigation */}
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
                    <Button variant="ghost">{link.label}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {link.subLinks.map((subLink) => (
                      <Link key={subLink.href} href={subLink.href} passHref>
                        <DropdownMenuItem>{subLink.label}</DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link key={link.href} href={link.href} passHref>
                <Button variant="ghost">{link.label!}</Button>
              </Link>
            )
          )}
          <Link href="/donate" passHref>
            <Button>Donate</Button>
          </Link>
          {/* Login Dropdown */}
          <div
            onMouseEnter={() => setOpenDropdown(loginLinks.label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <DropdownMenu open={openDropdown === loginLinks.label}>
              <DropdownMenuTrigger asChild>
                 <Button variant="outline">{loginLinks.label}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {loginLinks.subLinks.map((subLink) => (
                  <Link key={subLink.href} href={subLink.href} passHref>
                    <DropdownMenuItem>Login {subLink.label}</DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Mobile Navigation */}
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
                      <AccordionItem value={link.label!} className="border-b-0">
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
                    <Link key={link.href} href={link.href} passHref>
                      <Button variant="ghost" className="w-full justify-start text-lg">{link.label!}</Button>
                    </Link>
                  )
                )}
                {/* Mobile Login Accordion */}
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

                <div className="border-t pt-4 mt-2">
                  <Link href="/donate" passHref>
                    <Button className="w-full">Donate</Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

