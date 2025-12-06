import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link2, FileText } from 'lucide-react';
import ApplySidebar from '@/components/residebar'; // Ensure this path is correct
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ResourceUploadForm from '@/components/resources/ResourceUploadForm';
import DeleteResourceButton from '@/components/resources/DeleteResourceButton';

export const dynamic = 'force-dynamic';

// --- 1. YOUR STATIC DATA ---
const staticCategories = [
  {
    title: "About Studying Abroad",
    links: [
      { name: "Happy Schools", url: "#", description: "All the information and guidance for abroad studies." },
      { name: "Applying to US Universities", url: "#", description: "A resource for students applying to universities in USA." },
    ]
  },
  // ... (Keep your other static categories here)
];

// --- 2. HELPER TO MERGE DATA ---
async function getCombinedResources() {
  const dbResources = await prisma.resource.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const combined = JSON.parse(JSON.stringify(staticCategories));

  dbResources.forEach((res) => {
    const existingCategory = combined.find((c: any) => c.title === res.category);
    const newLink = {
      id: res.id,
      name: res.title,
      url: res.fileUrl,
      description: res.description,
      authorId: res.authorId,
      isDynamic: true,
    };

    if (existingCategory) {
      existingCategory.links.unshift(newLink);
    } else {
      combined.push({
        title: res.category,
        links: [newLink]
      });
    }
  });

  return combined;
}

export default async function ResourcesPage() {
  const session = await getServerSession(authOptions);
  const categories = await getCombinedResources();

  // --- PERMISSION FIX ---
  const roles = session?.user?.roles || [];
  
  // 1. Allow Admins, Sub-admins, Mentors, Sponsors to Upload
  const isUploader = roles.some(r => ['admin', 'subadmin', 'mentor', 'sponsor'].includes(r));
  
  // 2. Allow Admins and Sub-admins to Delete
  const isAdmin = roles.some(r => ['admin', 'subadmin'].includes(r));

  return (
    <div className="bg-background text-foreground min-h-screen">
      
      <header className="bg-muted py-20 text-center">
        <div className="container mx-auto px-4">
           <h1 className="text-5xl font-extrabold tracking-tight">Resources</h1>
           <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
               A curated list of guides, tools, and platforms to help you succeed in your graduate school applications.
           </p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
                
                {/* Upload Form */}
                {isUploader && (
                  <div className="mb-8">
                    <ResourceUploadForm />
                  </div>
                )}

                {/* Dynamic Accordion */}
                {categories.length > 0 ? (
                  <Accordion type="multiple" className="w-full" defaultValue={[categories[0].title]}>
                    {categories.map((category: any) => (
                      <AccordionItem value={category.title} key={category.title}>
                        <AccordionTrigger className="text-2xl font-bold text-left">
                          {category.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-6 pt-4">
                            {category.links.map((link: any, index: number) => {
                              // Check permission: Admin OR Owner of the resource
                              const isOwner = session?.user?.id === link.authorId;
                              const canDelete = (isOwner || isAdmin) && link.isDynamic;

                              return (
                                <li key={link.id || index} className="flex items-start justify-between group">
                                  <div className="flex items-start">
                                    <Link2 className={`w-5 h-5 mr-4 mt-1 flex-shrink-0 ${link.isDynamic ? 'text-orange-500' : 'text-primary'}`} />
                                    <div>
                                      <a 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="group-hover:underline"
                                      >
                                        <h4 className="font-semibold text-lg">{link.name}</h4>
                                      </a>
                                      {link.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {link.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Delete Button */}
                                  {canDelete && (
                                    <DeleteResourceButton id={link.id} />
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No resources found.</p>
                  </div>
                )}
            </div>
            
            {/* Reusable Sidebar */}
            <aside className="lg:col-span-1 mt-12 lg:mt-0">
              <ApplySidebar />
            </aside>
        </div>
      </main>

    </div>
  );
}