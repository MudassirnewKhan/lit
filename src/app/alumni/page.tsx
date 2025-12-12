import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Quote, Star } from 'lucide-react';
import ApplySidebar from '@/components/residebar';
import Link from 'next/link'; // <--- 1. Import Link

// --- 1. STATIC DATA (Your existing history) ---
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

const staticAwardees = [
    { year: "2024-25", scholars: [ { name: "Priya Sharma", institution: "Indian Institute of Technology, Bombay" }, { name: "Rahul Verma", institution: "University of Delhi" } ] },
    { year: "2023-24", scholars: [ { name: "Aadil Masood", institution: "Cochin University of Science and Technology (CUAST), Kochi" }, { name: "Uzma Mansoori", institution: "Jawaharlal Nehru Centre for Advanced Scientific Research (JNCASR), Bangalore" }, { name: "Dr. Asif Alvi", institution: "Jawaharlal Nehru Medical College (JNMC), AMU, Aligarh" }, ] },
    { year: "2022-23", scholars: [ { name: "Mohammad Azam", institution: "Inha University , Incheon , South Korea" }, { name: "Rihan Alvi", institution: "Engineering, AMU" } ] },
    { year: "2021-22", scholars: [ { name: "Asif Ashfaq Khan", institution: "Dr. Y.S. Parmar University of Horticulture & Forestry" }, { name: "Shah Kamran Ahmad", institution: "Interdisciplinary Biotechnology Unit, A. M.U, Aligarh" } ] },
    { year: "2020-21", scholars: [ { name: "Mohammed Danish", institution: "National Prawn Laboratory, Al-Lith, Saudi Arabia" }, { name: "Fatima Khan", institution: "Indian Institute of Science, Bangalore" } ] },
    { year: "2019-20", scholars: [ { name: "Ananya Gupta", institution: "Jadavpur University, Kolkata" }, { name: "Vikram Singh", institution: "National Institute of Design, Ahmedabad" } ] },
    { year: "2018-19", scholars: [ { name: "Zoya Akhtar", institution: "Tata Institute of Social Sciences, Mumbai" }, { name: "Arjun Reddy", institution: "Manipal Institute of Technology" } ] },
];

const staticSuccessfulScholars = [
    { year: "2025", scholars: [ { name: "Adil Masood", achievement: "PhD, University of Ghent, Belgium" }, { name: "Asif Alvi", achievement: "MS, Boston University, USA" } ] },
    { year: "2024", scholars: [ { name: "Asif A. Khan", achievement: "PhD, Ben Gurion Univ, Israel" }, { name: "Uzma Mansoori", achievement: "MBA, Liverpool John Moores University, UK" } ] },
    { year: "2023", scholars: [ { name: "Mohammed Danish", achievement: "PhD in Chemistry, University of Science Malaysia" }, { name: "Zoya Akhtar", achievement: "Policy Advisor, United Nations" } ] },
    { year: "2022", scholars: [ { name: "Ananya Gupta", achievement: "Lead UX Designer, Google" }, { name: "Arjun Reddy", achievement: "Founder, HealthTech Startup" } ] },
    { year: "2021", scholars: [ { name: "Vikram Singh", achievement: "Senior Industrial Designer, Tata Elxsi" } ] },
    { year: "2020", scholars: [ { name: "Fatima Khan", achievement: "Postdoctoral Researcher, Stanford University" } ] },
    { year: "2019", scholars: [ { name: "Priya Sharma", achievement: "Data Scientist, Microsoft" } ] },
    { year: "2018", scholars: [ { name: "Rahul Verma", achievement: "Civil Services Officer, Government of India" } ] },
];

// --- 2. MERGE LOGIC (Server Side) ---
async function getMergedData() {
  // Fetch new data from DB
  const dbAlumni = await prisma.alumni.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Clone static data so we can modify it
  let mergedTestimonials = [...staticTestimonials];
  let mergedAwardees = JSON.parse(JSON.stringify(staticAwardees)); 
  let mergedSuccess = JSON.parse(JSON.stringify(staticSuccessfulScholars));

  // Loop through DB entries and inject them into the static lists
  dbAlumni.forEach((entry) => {
    if (entry.category === 'TESTIMONIAL') {
      mergedTestimonials.unshift({
        quote: entry.quote || "",
        name: entry.fullName,
        year: entry.batchYear,
        imgSrc: entry.photoUrl || "https://placehold.co/100x100/E2E8F0/4A5568?text=" + entry.fullName[0]
      });
    } 
    else if (entry.category === 'AWARDEE') {
      let yearGroup = mergedAwardees.find((g: any) => g.year === entry.batchYear);
      
      // <--- 2. Capture User ID for Linking --->
      const newScholar = { 
          name: entry.fullName, 
          institution: entry.institution || "", 
          userId: entry.userId 
      };
      
      if (yearGroup) {
        yearGroup.scholars.unshift(newScholar);
      } else {
        mergedAwardees.unshift({
          year: entry.batchYear,
          scholars: [newScholar]
        });
      }
    }
    else if (entry.category === 'SUCCESS_STORY') {
      let yearGroup = mergedSuccess.find((g: any) => g.year === entry.batchYear);
      
      // <--- 3. Capture User ID for Linking --->
      const newScholar = { 
          name: entry.fullName, 
          achievement: entry.achievement || "", 
          userId: entry.userId 
      };

      if (yearGroup) {
        yearGroup.scholars.unshift(newScholar);
      } else {
        mergedSuccess.unshift({
          year: entry.batchYear,
          scholars: [newScholar]
        });
      }
    }
  });

  return { 
    testimonials: mergedTestimonials, 
    awardees: mergedAwardees, 
    successStories: mergedSuccess 
  };
}

export default async function AlumniPage() {
  const { testimonials, awardees, successStories } = await getMergedData();

  return (
    <div className="bg-background text-foreground">

      <header className="bg-muted py-20 text-center">
        <div className="container mx-auto px-4">
            <h1 className="text-5xl font-extrabold tracking-tight">Our Alumni</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                Celebrating the achievements and stories of our past scholars who continue to lead, ignite, and transform the world.
            </p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
            <div className="lg:col-span-3 space-y-16">

                {/* TESTIMONIALS */}
                <section id="testimonials" className="scroll-mt-20">
                    <h2 className="text-3xl font-bold mb-8 text-center">Testimonials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial: any, index: number) => (
                            <Card key={index} className="flex flex-col">
                                <CardContent className="pt-6 flex-grow">
                                    <Quote className="w-8 h-8 text-primary mb-4" />
                                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                                </CardContent>
                                <div className="bg-muted p-4 flex items-center gap-4 mt-auto">
                                    <Avatar>
                                        <AvatarImage src={testimonial.imgSrc} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.year}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <Separator />

                {/* AWARDEES - CLICKABLE */}
                <section id="awardees" className="scroll-mt-20">
                    <h2 className="text-3xl font-bold mb-8 text-center">Awardees by Year</h2>
                    <Tabs defaultValue={awardees[0]?.year} className="w-full">
                        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                            <TabsList>
                                {awardees.map((item: any) => (
                                    <TabsTrigger key={item.year} value={item.year}>{item.year}</TabsTrigger>
                                ))}
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        {awardees.map((item: any) => (
                            <TabsContent key={item.year} value={item.year} className="mt-4">
                                <Card>
                                    <CardContent className="p-6">
                                        <ul className="space-y-4">
                                            {item.scholars.map((scholar: any, i: number) => (
                                                <li key={i} className="border-b pb-2 last:border-b-0 last:pb-0">
                                                    {/* <--- 4. CLICKABLE LINK LOGIC ---> */}
                                                    {scholar.userId ? (
                                                        <Link href={`/profile/${scholar.userId}`} className="font-semibold hover:underline hover:text-blue-600 transition-colors">
                                                            {scholar.name}
                                                        </Link>
                                                    ) : (
                                                        <p className="font-semibold">{scholar.name}</p>
                                                    )}
                                                    <p className="text-sm text-muted-foreground">{scholar.institution}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </section>

                <Separator />
                
                {/* SUCCESSFUL SCHOLARS - CLICKABLE */}
                <section id="successful-scholars" className="scroll-mt-20">
                    <h2 className="text-3xl font-bold mb-8 text-center">Successful Scholars</h2>
                      <Tabs defaultValue={successStories[0]?.year} className="w-full">
                        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                            <TabsList>
                                {successStories.map((item: any) => (
                                    <TabsTrigger key={item.year} value={item.year}>{item.year}</TabsTrigger>
                                ))}
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        {successStories.map((item: any) => (
                            <TabsContent key={item.year} value={item.year} className="mt-4">
                                <Card>
                                    <CardContent className="p-6">
                                        <ul className="space-y-4">
                                            {item.scholars.map((scholar: any, i: number) => (
                                                <li key={i} className="flex items-center">
                                                    <Star className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                                                    <div>
                                                        {/* <--- 5. CLICKABLE LINK LOGIC ---> */}
                                                        {scholar.userId ? (
                                                            <Link href={`/profile/${scholar.userId}`} className="font-semibold hover:underline hover:text-blue-600 transition-colors">
                                                                {scholar.name}
                                                            </Link>
                                                        ) : (
                                                            <p className="font-semibold">{scholar.name}</p>
                                                        )}
                                                        <p className="text-sm text-muted-foreground">{scholar.achievement}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </section>
            </div>
            
            <aside className="lg:col-span-1 mt-12 lg:mt-0">
              <ApplySidebar/>
            </aside>
        </div>
      </main>
    </div>
  );
}