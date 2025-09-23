'use client';

import React, { useState } from 'react';
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
import { Award, Menu } from 'lucide-react';
import { Label } from '@radix-ui/react-dropdown-menu';

// Updated navigation links to include sub-links for both dropdowns
const navLinks = [
  { href: '/', label: 'Home' },
  {
    label: 'About',
    subLinks: [
      { href: '/about/foundation', label: 'Foundation of LIT' },
      { href: '/about/mission', label: 'Mission' },
      { href: '/about/members', label: 'Members' },
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
  { label: 'Alumni' ,
    subLinks: [
        {href: '/alumini/testomonials', label: 'Testomonials'},
        {href: '/alumimi/awardees', label:'Awardees'},
        {href: '/alumini/succesfulscholars' , label:'Succesful Scholars'},
    ]
  },
  { href: '/resources', label: 'Resources' },
  { href: '/policies', label: 'Policies' },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="w-full h-16 bg-card sticky top-0 z-50 border-b flex items-center">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        <a href="/" className="font-bold text-xl text-primary">
          Scholarship Portal
        </a>

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
                      <a key={subLink.href} href={subLink.href}>
                        <DropdownMenuItem>{subLink.label}</DropdownMenuItem>
                      </a>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <a key={link.href} href={link.href}>
                <Button variant="ghost">{link.label!}</Button>
              </a>
            )
          )}
          <a href="/donate">
            <Button>Donate</Button>
          </a>
          <a href="/login">
            <Button variant="outline">Login</Button>
          </a>
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
                            <a key={subLink.href} href={subLink.href} className="block py-2 text-muted-foreground hover:text-foreground">
                              {subLink.label}
                            </a>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <a key={link.href} href={link.href}>
                      <Button variant="ghost" className="w-full justify-start text-lg">{link.label!}</Button>
                    </a>
                  )
                )}
                <div className="border-t pt-4 mt-2 flex flex-col gap-2">
                  <a href="/donate">
                    <Button className="w-full">Donate</Button>
                  </a>
                   <a href="/login">
                    <Button variant="outline" className="w-full">Login</Button>
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

