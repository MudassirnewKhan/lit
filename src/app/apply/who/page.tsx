import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, ArrowRight, Newspaper, Users, Facebook, Award } from 'lucide-react';
import ApplySidebar from '@/components/residebar';

const eligibilityCriteria = [
  "Must be a currently enrolled, full-time student at the university.",
  "A minimum cumulative GPA of 3.0 on a 4.0 scale.",
  "Demonstrated leadership potential and a passion for community service.",
  "Must submit a completed application form, including the statement of purpose, by the deadline.",
];

const faqs = [
    {
        question: "Is this scholarship only for undergraduate students?",
        answer: "Yes, the LIT Program is currently open to full-time undergraduate students from all disciplines who meet the eligibility criteria."
    },
    {
        question: "Is there an application fee?",
        answer: "No, there is absolutely no fee to apply for the LIT scholarship. We encourage all eligible students to apply."
    },
    {
        question: "Can international students apply?",
        answer: "Yes, international students who are enrolled full-time at the university are welcome and encouraged to apply."
    }
];

export default function WhoCanApplyPage() {
  return (
    <div className="bg-background text-foreground">
      

      <main className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
          
          {/* Main Content Section */}
          <div className="lg:col-span-3">
            <section className="mb-16">
              <h1 className="text-4xl font-extrabold tracking-tight mb-4">Who Can Apply?</h1>
              <p className="text-muted-foreground text-lg mb-8">
                The LIT Scholarship Program is designed for students who demonstrate academic excellence, leadership potential, and a commitment to making a positive impact.
              </p>
              <ul className="space-y-4">
                {eligibilityCriteria.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator className="my-12" />

            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
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
                <p className="mt-6 text-muted-foreground">
                    Have more questions? <a href="/apply/faqs" className="text-primary hover:underline">Check our full FAQs page</a>.
                </p>
            </section>
            
            <Separator className="my-12" />

            <section className="text-center bg-muted p-8 rounded-lg">
                <h2 className="text-3xl font-bold">Ready to Transform Your Future?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    If you meet the criteria and are ready to join a community of leaders and innovators, we encourage you to start your application today.
                </p>
                <a href="/apply/start">
                    <Button size="lg" className="mt-6">
                        Start Your Application Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </a>
            </section>
          </div>

          {/* Sidebar Section */}
         <ApplySidebar/>
        </div>
      </main>

    
    </div>
  );
}

