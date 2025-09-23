import React from 'react';
import { Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-foreground">Scholarship Portal</h3>
            <p className="mt-4">
              Empowering the next generation of leaders through the LIT program.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-wider text-foreground">Contact LIT</h3>
            <div className="mt-4 space-y-2">
              <p>Main Office:<br/>123 University Ave,<br/>Innovation City, 10101</p>
              <p>contact@litprogram.uni</p>
              <p>(123) 456-7890</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-wider text-foreground">Quick Links</h3>
            <div className="mt-4 space-y-2 flex flex-col">
              <a href="#" className="hover:text-foreground">About Us</a>
              <a href="#" className="hover:text-foreground">Mentors</a>
              <a href="#" className="hover:text-foreground">Sponsors</a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-wider text-foreground">Follow Us</h3>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="hover:text-foreground">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-foreground">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} University Scholarship Program. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

