import React from 'react';
import { prisma } from '@/lib/prisma';
import { Separator } from '@/components/ui/separator';
import ApplySidebar from '@/components/residebar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Quote } from 'lucide-react'; // Import icon directly here

// Components
import AlumniList from '@/components/alumni/AlumniList';
import SuccessStoryManager from '@/components/alumni/SuccessStoryManager';

// --- 3 STATIC TESTIMONIALS ONLY ---
const staticTestimonials = [
  {
    quote: "The LIT program was a transformative experience. The mentorship I received was invaluable and directly contributed to my career success.",
    name: "Aadil Masood",
    year: "2018 Scholar",
    imgSrc: "https://placehold.co/100x100/E2E8F0/4A5568?text=AM"
  },
  {
    quote: "Being a part of this community opened doors I never thought possible. It's more than a scholarship; it's a lifelong network.",
    name: "Uzma Mansoori",
    year: "2019 Scholar",
    imgSrc: "https://placehold.co/100x100/E2E8F0/4A5568?text=UM"
  },
  {
    quote: "The project funding allowed me to turn my academic research into a real-world prototype. I'm forever grateful for that opportunity.",
    name: "Rihan Alvi",
    year: "2020 Scholar",
    imgSrc: "https://placehold.co/100x100/E2E8F0/4A5568?text=RA"
  },
];

async function getPageData() {
  // Fetch History (Regular Scholars)
  const history = await prisma.alumni.findMany({
    where: { category: 'AWARDEE' },
    orderBy: { batchYear: 'desc' }
  });

  // Fetch Success Stories
  const successStories = await prisma.successStory.findMany({
    orderBy: { batchYear: 'desc' }
  });

  // Group History by Year
  const groupedHistory: Record<string, any[]> = {};
  history.forEach((h) => {
    const y = h.batchYear || 'Unknown';
    if (!groupedHistory[y]) groupedHistory[y] = [];
    groupedHistory[y].push(h);
  });

  return { groupedHistory, successStories };
}

export default async function AlumniPage() {
  const session = await getServerSession(authOptions);
  const userRoles = session?.user?.roles || [];
  const isAdmin = userRoles.includes('admin') || userRoles.includes('subadmin');

  const { groupedHistory, successStories } = await getPageData();

  return (
    <div className="bg-background text-foreground">
      <header className="bg-muted py-20 text-center">
        <div className="container mx-auto px-4">
            <h1 className="text-5xl font-extrabold tracking-tight">Our Alumni</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                Celebrating the achievements and stories of our past scholars.
            </p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
            
            {/* LEFT COLUMN: Main Content */}
            <div className="lg:col-span-3 space-y-16">
                
                {/* 1. TESTIMONIALS (Inlined Code - No extra file needed) */}
                <section id="testimonials">
                    <h2 className="text-3xl font-bold mb-8">What Our Scholars Say</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {staticTestimonials.map((t, index) => (
                            <div key={index} className="flex flex-col h-full bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-4">
                                    <Quote className="h-8 w-8 text-primary/20 mb-2" />
                                    <p className="text-muted-foreground italic leading-relaxed min-h-[80px]">
                                        "{t.quote}"
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 flex items-center gap-4 border-t">
                                    <img 
                                        src={t.imgSrc} 
                                        alt={t.name}
                                        className="h-10 w-10 rounded-full object-cover bg-gray-200"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.year}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <Separator />
                
                {/* 2. REGULAR AWARDEES LIST */}
                <section id="awardees">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">Awardees by Year</h2>
                        {isAdmin && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Admin Mode</span>}
                    </div>
                    <AlumniList groupedAlumni={groupedHistory} isAdmin={isAdmin} />
                </section>

                <Separator />
                
                {/* 3. SUCCESS STORIES MANAGER */}
                <section id="success-stories">
                    <h2 className="text-3xl font-bold mb-8">Successful Scholars</h2>
                    <SuccessStoryManager stories={successStories} isAdmin={isAdmin} />
                </section>

            </div>
            
            {/* RIGHT COLUMN: Sidebar */}
            <aside className="lg:col-span-1 mt-12 lg:mt-0">
              <ApplySidebar/>
            </aside>
        </div>
      </main>
    </div>
  );
}