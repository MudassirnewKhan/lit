'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetClose, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Menu, UserCircle, Shield } from 'lucide-react'; 
import LogoutButton from './LogoutButton';
import { Session } from 'next-auth';

type NavLink = {
  label: string;
  href?: string;
  subLinks?: { href: string; label: string }[];
};
type LoginLink = {
  label: string;
  subLinks: { href: string; label: string }[];
};

export default function NavbarClient({ session, navLinks, loginLinks }: { session: Session | null, navLinks: NavLink[], loginLinks: LoginLink }) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const isAdminUser = session?.user?.roles?.some(r => ['admin', 'subadmin'].includes(r));
  
  const isStudent = session?.user?.roles?.includes('awardee');
  const isMentor = session?.user?.roles?.includes('mentor');
  const isSponsor = session?.user?.roles?.includes('sponsor');

  const isUser = isStudent || isMentor || isSponsor;

  return (
    <header className="w-full h-16 bg-card sticky top-0 z-50 border-b flex items-center shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-bold text-xl text-primary">
          LIT Scholarship Portal
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Standard Public Links (About, Apply, etc.) */}
          {navLinks.map((link) =>
            link.subLinks ? (
              <div key={link.label} onMouseEnter={() => setOpenDropdown(link.label)} onMouseLeave={() => setOpenDropdown(null)}>
                <DropdownMenu open={openDropdown === link.label}>
                  <DropdownMenuTrigger asChild>
                    <Link href={link.subLinks[0].href.split('#')[0]} passHref><Button variant="ghost">{link.label}</Button></Link>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" onMouseLeave={() => setOpenDropdown(null)}>
                    {link.subLinks.map((subLink) => (
                      <DropdownMenuItem key={subLink.href} asChild>
                        <Link href={subLink.href}>{subLink.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link key={link.href} href={link.href!} passHref><Button variant="ghost">{link.label}</Button></Link>
            )
          )}
          
          {/* --- AUTHENTICATION MENU --- */}
          <div className="flex items-center gap-2 pl-4 border-l ml-2">
            {isAdminUser ? (
              // VIEW 1: ADMIN & SUB-ADMIN
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                    <Shield className="h-4 w-4" /> Admin Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link href="/admin/dashboard">Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/admin/applications">Applications</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/admin/users">Manage Users</Link></DropdownMenuItem>
                  {/* --- NEW LINK FOR ADMINS/STAFF --- */}
                  <DropdownMenuItem asChild><Link href="/mentorship">Mentorship Hub</Link></DropdownMenuItem>
                  {/* -------------------------------- */}
                  <DropdownMenuItem asChild><Link href="/feed">Community Feed</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}><LogoutButton /></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            ) : isUser ? (
              // VIEW 2: STUDENT / MENTOR / SPONSOR
              <>
                <Link href="/feed"><Button variant="ghost">Community Feed</Button></Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <UserCircle className="h-4 w-4"/> {session?.user?.name?.split(' ')[0] || 'Dashboard'}
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link href="/dashboard">My Dashboard</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/mentorship">Mentorship Hub</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/profile">My Profile</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><LogoutButton /></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>

            ) : (
              // VIEW 3: PUBLIC (Not Logged In)
              <>
                <Link href="/donate"><Button className="bg-green-600 hover:bg-green-700 text-white">Donate</Button></Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline">{loginLinks.label}</Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {loginLinks.subLinks.map((subLink) => (
                      <DropdownMenuItem key={subLink.href} asChild>
                        <Link href={subLink.href}>Login {subLink.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </nav>
        
        {/* --- MOBILE NAVIGATION --- */}
        <div className="md:hidden">
           <Sheet>
             <SheetTrigger asChild>
               <Button variant="outline" size="icon"><Menu className="h-6 w-6" /><span className="sr-only">Open Menu</span></Button>
             </SheetTrigger>
             <SheetContent side="right">
               <nav className="flex flex-col gap-2 mt-8">
                 {navLinks.map((link) =>
                   link.subLinks ? (
                     <Accordion type="single" collapsible className="w-full" key={link.label}>
                       <AccordionItem value={link.label} className="border-b-0">
                         <AccordionTrigger className="py-2 text-lg font-normal hover:no-underline">{link.label}</AccordionTrigger>
                         <AccordionContent className="pl-6">
                           {link.subLinks.map((subLink) => (
                             <SheetClose asChild key={subLink.href}><Link href={subLink.href} className="block py-2 text-muted-foreground hover:text-foreground">{subLink.label}</Link></SheetClose>
                           ))}
                         </AccordionContent>
                       </AccordionItem>
                     </Accordion>
                   ) : (
                     <SheetClose asChild key={link.href}><Link href={link.href!}><Button variant="ghost" className="w-full justify-start text-lg">{link.label}</Button></Link></SheetClose>
                   )
                 )}

                 <div className="border-t pt-4 mt-2 flex flex-col gap-2">
                   {isAdminUser ? (
                     <>
                       <SheetClose asChild><Link href="/admin/dashboard"><Button variant="outline" className="w-full">Admin Dashboard</Button></Link></SheetClose>
                       <SheetClose asChild><Link href="/admin/applications"><Button variant="ghost" className="w-full justify-start">Applications</Button></Link></SheetClose>
                       <SheetClose asChild><Link href="/admin/users"><Button variant="ghost" className="w-full justify-start">Manage Users</Button></Link></SheetClose>
                       {/* --- NEW LINK FOR MOBILE ADMINS --- */}
                       <SheetClose asChild><Link href="/mentorship"><Button variant="ghost" className="w-full justify-start">Mentorship Hub</Button></Link></SheetClose>
                       {/* ---------------------------------- */}
                       <SheetClose asChild><Link href="/feed"><Button variant="ghost" className="w-full justify-start">Community Feed</Button></Link></SheetClose>
                       <LogoutButton isMobile={true} />
                     </>
                   ) : isUser ? (
                      <>
                        <SheetClose asChild><Link href="/dashboard"><Button variant="outline" className="w-full">My Dashboard</Button></Link></SheetClose>
                        <SheetClose asChild><Link href="/mentorship"><Button variant="ghost" className="w-full justify-start">Mentorship</Button></Link></SheetClose>
                        <LogoutButton isMobile={true} />
                      </>
                   ) : (
                     <>
                       <SheetClose asChild><Link href="/donate"><Button className="w-full bg-green-600 hover:bg-green-700">Donate</Button></Link></SheetClose>
                       <Accordion type="single" collapsible className="w-full">
                           <AccordionItem value="login-item" className="border-b-0">
                               <AccordionTrigger className="py-2 text-lg font-normal hover:no-underline">{loginLinks.label}</AccordionTrigger>
                               <AccordionContent className="pl-6">
                                   {loginLinks.subLinks.map((subLink) => (
                                     <SheetClose asChild key={subLink.href}><Link href={subLink.href} className="block py-2 text-muted-foreground hover:text-foreground">Login {subLink.label}</Link></SheetClose>
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
      </div>
    </header>
  );
}