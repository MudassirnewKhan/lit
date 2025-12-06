import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Building, Target, Users, Landmark, HeartHandshake } from 'lucide-react';
import ApplySidebar from '@/components/residebar';

// Placeholder data for team members and sponsors
const executiveCommittee = [
  { name: 'Dr. Evelyn Reed', title: 'Chairperson & Founder', initials: 'ER', imgSrc: 'https://placehold.co/100x100/E2E8F0/4A5568?text=ER' },
  { name: 'Mr. David Chen', title: 'Vice-Chair & Treasurer', initials: 'DC', imgSrc: 'https://placehold.co/100x100/E2E8F0/4A5568?text=DC' },
  { name: 'Prof. Maria Garcia', title: 'Head of Mentorship', initials: 'MG', imgSrc: 'https://placehold.co/100x100/E2E8F0/4A5568?text=MG' },
];

const advisoryBoard = [
  { name: 'Johnathan Lee', title: 'CEO, Tech Innovations Inc.', initials: 'JL' },
  { name: 'Sophia Miller', title: 'Founder, Global Outreach Foundation', initials: 'SM' },
  { name: 'Ken Williams', title: 'Partner, W&P Law Firm', initials: 'KW' },
];

const sponsors = [
    { name: 'Innovate Corp', imgSrc: 'https://placehold.co/150x80/E2E8F0/4A5568?text=Innovate+Corp' },
    { name: 'Global Tech Foundation', imgSrc: 'https://placehold.co/150x80/E2E8F0/4A5568?text=Global+Tech' },
    { name: 'University Alumni Network', imgSrc: 'https://placehold.co/150x80/E2E8F0/4A5568?text=Alumni+Network' },
    { name: 'Quantum Solutions', imgSrc: 'https://placehold.co/150x80/E2E8F0/4A5568?text=Quantum' },
];


export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">

      {/* Page Header */}
      <header className="bg-muted py-20 text-center">
        <div className="container mx-auto px-4">
            <h1 className="text-5xl font-extrabold tracking-tight">About the LIT Program</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                Discover the story, people, and purpose behind the scholarship dedicated to fostering the next generation of leaders.
            </p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-16">
                {/* Foundation Section */}
                <section id="foundation" className="grid md:grid-cols-5 gap-8 items-center scroll-mt-20">
                    <div className="md:col-span-2 flex justify-center">
                        <Building className="w-32 h-32 text-primary" />
                    </div>
                    <div className="md:col-span-3">
                        <h2 className="text-3xl font-bold mb-4">Foundation of LIT</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Founded in 2015, the LIT (Lead, Ignite, Transform) Scholarship Program was established with the vision of creating more than just a financial grant. It was built on the belief that true potential is unlocked through a combination of academic support, dedicated mentorship, and real-world opportunities.
                        </p>
                    </div>
                </section>

                <Separator />

                {/* Mission Section */}
                <section id="mission" className="grid md:grid-cols-5 gap-8 items-center scroll-mt-20">
                     <div className="md:col-span-3">
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Our mission is to identify and nurture exceptional students, empowering them with the resources, mentorship, and network needed to transform their innovative ideas into tangible, positive change for society.
                        </p>
                    </div>
                     <div className="md:col-span-2 flex justify-center">
                        <Target className="w-32 h-32 text-primary" />
                    </div>
                </section>

                <Separator />

                {/* Members Section */}
                <section id="members" className="text-center scroll-mt-20">
                    <h2 className="text-3xl font-bold mb-10">Our Team & Leadership</h2>
                    
                    <div id="executive-committee" className="scroll-mt-20">
                        <h3 className="text-2xl font-semibold mb-6">Executive Committee</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {executiveCommittee.map(member => (
                                <Card key={member.name} className="text-center">
                                    <CardContent className="flex flex-col items-center pt-6">
                                        <Avatar className="h-24 w-24 mb-4">
                                            <AvatarImage src={member.imgSrc} alt={member.name} />
                                            <AvatarFallback>{member.initials}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.title}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div id="advisory-board" className="mt-12 scroll-mt-20">
                        <h3 className="text-2xl font-semibold mb-6">Advisory Board</h3>
                        <div className="max-w-3xl mx-auto text-muted-foreground text-lg">
                            <p>Our program is guided by a distinguished advisory board composed of industry leaders, innovators, and philanthropists who provide strategic direction.</p>
                            <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4 font-semibold">
                                {advisoryBoard.map(member => <span key={member.name}>{member.name}</span>)}
                            </div>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Leadership History */}
                <section id="history" className="text-center max-w-4xl mx-auto scroll-mt-20">
                    <Landmark className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Leadership History</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Since our inception, the LIT Program has been led by individuals dedicated to student success. Our leadership history reflects a continuous commitment to adapting and growing the program to meet the evolving challenges our scholars face.
                    </p>
                </section>

                <Separator />

                {/* Sponsors & Contributors Section */}
                <section id="sponsors" className="text-center scroll-mt-20">
                    <HeartHandshake className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Sponsors & Contributors</h2>
                    <p className="text-muted-foreground text-lg max-w-4xl mx-auto mb-8">
                        This program is made possible by the generous support of our sponsors and contributors who believe in the power of education and leadership. We are immensely grateful for their partnership.
                    </p>
                    <div className="flex justify-center items-center flex-wrap gap-8">
                        {sponsors.map(sponsor => (
                            <img key={sponsor.name} src={sponsor.imgSrc} alt={sponsor.name} className="h-16" />
                        ))}
                    </div>
                </section>
            </div>
            
            {/* Reusable Sidebar */}
            <aside className="lg:col-span-1 mt-12 lg:mt-0">
              <ApplySidebar/>
            </aside>
        </div>
      </main>
    </div>
  );
}

