import React from 'react';
import Navbar from '../../components/header';
import Footer from '../../components/footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link2 } from 'lucide-react';
import ApplySidebar from '@/components/residebar';

// Organized resource data from user input
const resourceCategories = [
  {
    title: "About Studying Abroad",
    links: [
      { name: "Happy Schools", url: "#", description: "All the information and guidance for abroad studies." },
      { name: "Applying to US Universities", url: "#", description: "A resource for students applying to universities in USA." },
      { name: "Graduate student funding opportunities", url: "#", description: "Free lists of grants and fellowships around the world." },
      { name: "Post Doctoral funding opportunities", url: "#", description: "Free lists of grants and fellowships around the world." },
      { name: "Resources for Physics Grad schools in US", url: "#", description: "Browse details of most US Physics Graduate Programs." },
    ]
  },
  {
    title: "LIT Country-Specific Guides",
    links: [
      { name: "LIT Guide to Germany", url: "#", description: "A resource for students applying to universities in Germany." },
      { name: "LIT Guide to France", url: "#", description: "A resource for students applying to universities in France." },
      { name: "LIT Guide to Canada", url: "#", description: "A resource for students applying to universities in Canada." },
      { name: "LIT Guide to UK", url: "#", description: "A resource for students applying to universities in UK." },
    ]
  },
  {
    title: "LIT Document-Specific Guides & Webinars",
    links: [
      { name: "Statement of Purpose Guide", url: "#", description: "Essential components of the statement of purpose." },
      { name: "Webinar: SoP Writing", url: "#", description: "Communicating Your True Potential." },
      { name: "Webinar: CV/Resume Writing", url: "#", description: "Learn how to craft the perfect CV/Resume." },
      { name: "Webinar: Networking", url: "#", description: "Effective Communication For Successful Professional Careers." },
      { name: "Webinar: University Selection", url: "#", description: "Shortlisting universities & preparing strong applications." },
      { name: "LIT Convention 2024 Recording", url: "#", description: "Watch the full recording of the LIT Convention." },
      { name: "LIT Youtube Channel", url: "#", description: "Follow our Youtube channel for other webinars." },
    ]
  },
  {
    title: "GRE Preparation",
    links: [
        { name: "GRE Official Website", url: "#", description: "Official information regarding the GRE test." },
        { name: "Majortests.com GRE preparation", url: "#", description: "A portal for GRE preparation & for practice tests." },
        { name: "Magoosh Youtube Channel", url: "#", description: "Great GRE tutorials, especially Vocab Wednesdays." },
        { name: "Memrise Vocab Builder", url: "#", description: "Build vocabulary with lots of GRE flash cards." },
        { name: "Khan Academy Quant Videos", url: "#", description: "Free preparation for the GRE Quantitative Reasoning measure." },
    ]
  },
  {
    title: "TOEFL Preparation",
    links: [
        { name: "TOEFL Official Website", url: "#", description: "Official information regarding the TOEFL test." },
        { name: "TOEFL Ebook Sample Questions", url: "#", description: "Sample questions from the official test-makers." },
        { name: "Notefull TOEFL Prep Material", url: "#", description: "Handouts and useful resources on TOEFL preparation." },
    ]
  }
];

export default function ResourcesPage() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />

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
            <div className="lg:col-span-3">
                <Accordion type="multiple" className="w-full">
                    {resourceCategories.map((category) => (
                        <AccordionItem value={category.title} key={category.title}>
                            <AccordionTrigger className="text-2xl font-bold">{category.title}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-6 pt-4">
                                    {category.links.map((link) => (
                                        <li key={link.name}>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start group">
                                                <Link2 className="w-5 h-5 text-primary mr-4 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold group-hover:underline">{link.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{link.description}</p>
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            
            {/* Reusable Sidebar */}
            <aside className="lg:col-span-1 mt-12 lg:mt-0">
              <ApplySidebar/>
            </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

