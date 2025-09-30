import React from 'react';
import Navbar from '../../../components/header';
import Footer from '../../../components/footer';
import ApplySidebar from '../../../components/residebar';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CalendarDays } from 'lucide-react';

const timelineSteps = [
    {
        date: "October 1, 2025",
        title: "Applications Open",
        description: "The online application portal opens for all eligible students. Ensure you meet the criteria before starting."
    },
    {
        date: "December 15, 2025",
        title: "Application Deadline",
        description: "All application materials, including the statement of purpose and any supporting documents, must be submitted by 11:59 PM."
    },
    {
        date: "January 2026",
        title: "Application Review",
        description: "Our committee carefully reviews all submitted applications. Shortlisted candidates may be contacted for an interview."
    },
    {
        date: "February 15, 2026",
        title: "Decisions Announced",
        description: "All applicants will be notified of their application status via email. Successful awardees will receive an official offer."
    }
];

const faqs = [
    {
        question: "Can I edit my application after submitting it?",
        answer: "No, once an application is submitted, it cannot be edited. Please review your submission carefully before finalizing it."
    },
    {
        question: "Are late applications accepted?",
        answer: "Unfortunately, due to the high volume of applications, we cannot accept any submissions after the deadline. We recommend applying well in advance."
    }
];

export default function AppTimelinePage() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
          
          {/* Main Content Section */}
          <div className="lg:col-span-3">
            <section id="timeline" className="mb-16">
              <h1 className="text-4xl font-extrabold tracking-tight mb-4">Application Timeline</h1>
              <p className="text-muted-foreground text-lg mb-10">
                Stay informed about the key dates and deadlines for the 2025-2026 LIT Scholarship application cycle.
              </p>
              <div className="space-y-8">
                {timelineSteps.map((step, index) => (
                    <div key={index} className="flex items-start">
                        <div className="flex flex-col items-center mr-6">
                            <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl">{index + 1}</div>
                            {index < timelineSteps.length - 1 && <div className="w-px h-24 bg-border mt-2"></div>}
                        </div>
                        <div>
                            <p className="font-semibold text-muted-foreground flex items-center"><CalendarDays className="h-4 w-4 mr-2" />{step.date}</p>
                            <h3 className="text-2xl font-bold mt-1">{step.title}</h3>
                            <p className="mt-2 text-muted-foreground">{step.description}</p>
                        </div>
                    </div>
                ))}
              </div>
            </section>

            <Separator className="my-12" />

            <section id="faq" className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Timeline FAQs</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>
            
            <Separator className="my-12" />

            <section id="apply" className="text-center bg-muted p-8 rounded-lg">
                <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Now that you know the timeline, take the next step and begin your application.
                </p>
                <a href="/apply/start">
                    <Button size="lg" className="mt-6">
                        Start Your Application Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </a>
            </section>
          </div>

          {/* Reusable Sidebar */}
          <ApplySidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}

