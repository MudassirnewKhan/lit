import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Newspaper, Users, Facebook, Award } from 'lucide-react';

export default function ApplySidebar() {
  return (
    <aside className="lg:col-span-1 mt-12 lg:mt-0 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Support Our Scholars</CardTitle>
          <CardDescription>Your contribution makes a difference.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground">Pledge your support to LIT by sponsoring a student or becoming a regular patron.</p>
          <a href="/donate">
              <Button className="w-full">Donate Now</Button>
          </a>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Community Updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <a href="#" className="flex items-start group">
                  <Newspaper className="h-5 w-5 text-muted-foreground mr-3 mt-1" />
                  <span className="group-hover:text-primary transition-colors">The LIT Program results (2025-2026) announced</span>
              </a>
               <Separator />
               <a href="#" className="flex items-start group">
                  <Award className="h-5 w-5 text-muted-foreground mr-3 mt-1" />
                  <span className="group-hover:text-primary transition-colors">LIT Convention 2025</span>
              </a>
               <Separator />
              <a href="#" className="flex items-start group">
                  <Users className="h-5 w-5 text-muted-foreground mr-3 mt-1" />
                  <span className="group-hover:text-primary transition-colors">LIT Alumni Association (LIAA)</span>
              </a>
               <Separator />
              <a href="#" className="flex items-start group">
                  <Facebook className="h-5 w-5 text-muted-foreground mr-3 mt-1" />
                  <span className="group-hover:text-primary transition-colors">Join our Facebook Group</span>
              </a>
          </CardContent>
      </Card>
    </aside>
  );
}
