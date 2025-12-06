import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import ApplySidebar from '@/components/residebar';

// A more comprehensive list of FAQs organized by category
const faqCategories = [
    {
        category: "Eligibility",
        questions: [
            {
                question: "Is this scholarship only for undergraduate students?",
                answer: "Yes, the LIT Program is currently open to full-time undergraduate students from all disciplines who meet the eligibility criteria."
            },
            {
                question: "Can international students apply?",
                answer: "Yes, international students who are enrolled full-time at the university and meet all other criteria are welcome and encouraged to apply."
            },
            {
                question: "Do I need to have a specific major to be eligible?",
                answer: "No, the LIT Program is open to students from all majors and departments. We value a diverse cohort of scholars with varied academic interests."
            }
        ]
    },
    {
        category: "Application Process",
        questions: [
            {
                question: "Is there an application fee?",
                answer: "No, there is absolutely no fee to apply for the LIT scholarship. We encourage all eligible students to apply."
            },
            {
                question: "What documents do I need to submit with my application?",
                answer: "You will need to submit your completed application form, a statement of purpose, your most recent academic transcript, and at least one letter of recommendation."
            },
            {
                question: "Can I edit my application after submitting it?",
                answer: "No, once an application is submitted, it cannot be edited. Please review your submission carefully before finalizing it. For critical updates, please contact our support team."
            },
        ]
    },
    {
        category: "Financials & Program Details",
        questions: [
            {
                question: "What does the scholarship cover?",
                answer: "The scholarship provides a significant financial award that can be used for tuition, fees, and other educational expenses. It also includes funding for a capstone project and access to exclusive workshops."
            },
            {
                question: "Is this a one-time award, or is it renewable?",
                answer: "The LIT scholarship is a one-time award for the academic year. However, scholars in good standing may be invited to apply for continuing mentorship and project funding opportunities."
            }
        ]
    }
];

export default function FaqsPage() {
  return (
    <div className="bg-background text-foreground">
    

      <main className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
          
          {/* Main Content Section */}
          <div className="lg:col-span-3">
            <section id="faqs" className="mb-16">
              <h1 className="text-4xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h1>
              <p className="text-muted-foreground text-lg mb-10">
                Find answers to common questions about eligibility, the application process, and the LIT program itself.
              </p>
              
              {faqCategories.map((category) => (
                <div key={category.category} className="mb-10">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category.category}</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, index) => (
                            <AccordionItem value={`${category.category}-item-${index}`} key={index}>
                                <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
              ))}
            </section>
            
            <Separator className="my-12" />

            <section id="apply" className="text-center bg-muted p-8 rounded-lg">
                <h2 className="text-3xl font-bold">Have More Questions?</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    If you can't find your answer here, feel free to contact our support team. Otherwise, start your application today!
                </p>
                <div className="flex justify-center items-center gap-4 mt-6">
                    <Button variant="outline">Contact Support</Button>
                    <a href="/apply/start">
                        <Button size="lg">
                            Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </a>
                </div>
            </section>
          </div>

          <ApplySidebar/>

        </div>
      </main>

    
    </div>
  );
}

