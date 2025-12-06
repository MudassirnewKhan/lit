import React from 'react';
import { getServerSession } from 'next-auth/next'; // Correct import for v4
import { authOptions } from '@/lib/auth';      // Correct auth config
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  // 1. Fetch the session securely on the server
  const session = await getServerSession(authOptions);

  // 2. Define your navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    {
      label: 'About',
      subLinks: [
        { href: '/about#foundation', label: 'Foundation of LIT' },
        { href: '/about#mission', label: 'Mission' },
        { href: '/about#executive-committee', label: 'Executive Committee' },
        { href: '/about#advisory-board', label: 'Advisory Board' },
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
        { href: '/alumni/#testimonials', label: 'Testimonials' },
        { href: '/alumni/#awardees', label: 'Awardees' },
        { href: '/alumni/#successful-scholars', label: 'Successful Scholars' },
      ],
    },
    { href: '/resources', label: 'Resources' },
    { href: '/policies', label: 'Policies' },
  ];

  // 3. Define login links
  const loginLinks = {
    label: 'Login',
    subLinks: [
      { href: '/login/awardee', label: 'as Scholar' },
      { href: '/login/mentor', label: 'as Mentor' },
      { href: '/login/sponsor', label: 'as Sponsor' },
    ]
  };

  // 4. Render the Client Component with the session data
  return <NavbarClient session={session} navLinks={navLinks} loginLinks={loginLinks} />;
}