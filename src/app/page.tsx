import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Users, Flame, Rocket } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      {/* Navbar would be here */}
      
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center min-h-screen px-4">
        <h1 className="text-8xl md:text-9xl font-extrabold text-primary tracking-tighter">
          Lit.
        </h1>
        <p className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">
          Lead. Ignite. Transform.
        </p>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Our mission is to empower the next generation of innovators and leaders through dedicated mentorship and support. Discover your potential and change the world.
        </p>
      </main>

      {/* Content Section */}
      <section className="py-20 bg-muted/40 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">What is the LIT Program?</h2>
            <p className="mt-4 text-lg text-muted-foreground">It's a philosophy built on four core pillars.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center">
                  <Lightbulb className="h-10 w-10 text-primary mb-4" />
                </div>
                <CardTitle>Lit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sparking curiosity and illuminating new paths of knowledge through academic excellence and research.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
               <CardHeader>
                <div className="flex justify-center">
                  <Users className="h-10 w-10 text-primary mb-4" />
                </div>
                <CardTitle>Lead</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Cultivating leadership qualities to inspire action, manage teams, and drive meaningful change in the community.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
               <CardHeader>
                <div className="flex justify-center">
                  <Flame className="h-10 w-10 text-primary mb-4" />
                </div>
                <CardTitle>Ignite</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Fueling passion and ambition by connecting students with industry mentors and real-world projects.</p>
              </CardContent>
            </Card>
             <Card className="text-center">
               <CardHeader>
                <div className="flex justify-center">
                  <Rocket className="h-10 w-10 text-primary mb-4" />
                </div>
                <CardTitle>Transform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Empowering students to transform their ideas into reality, creating a lasting impact on society.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Image and Text Section */}
       <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div>
             <h2 className="text-4xl font-bold mb-4">From Idea to Impact</h2>
             <p className="text-lg text-muted-foreground mb-4">
              The University Scholarship Program isn't just about funding; it's about providing a complete ecosystem for growth. We provide the resources, mentorship, and network. You bring the vision and the drive.
             </p>
             <p className="text-lg text-muted-foreground">
              Our awardees have gone on to launch successful startups, publish groundbreaking research, and lead non-profits that have touched thousands of lives.
             </p>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <img src="https://placehold.co/600x400/3B82F6/FFFFFF?text=Innovation" alt="Innovation" className="rounded-lg shadow-lg aspect-video object-cover" />
              <img src="https://placehold.co/600x400/1F2937/FFFFFF?text=Collaboration" alt="Collaboration" className="rounded-lg shadow-lg aspect-video object-cover mt-8" />
              <img src="https://placehold.co/600x400/10B981/FFFFFF?text=Community" alt="Community" className="rounded-lg shadow-lg aspect-video object-cover" />
              <img src="https://placehold.co/600x400/F97316/FFFFFF?text=Leadership" alt="Leadership" className="rounded-lg shadow-lg aspect-video object-cover mt-8" />
           </div>
        </div>
      </section>


    </div>
  );
}

