import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// FIXED: Removed unused 'Users' and 'Handshake' imports
import { FileText, Award, Calendar, AlertTriangle, Info } from 'lucide-react';
import ApplySidebar from '@/components/residebar';

export default function PoliciesPage() {
  return (
    <div className="bg-background text-foreground">
      
      {/* Page Header */}
      <header className="bg-muted py-20 text-center">
        <div className="container mx-auto px-4">
            <h1 className="text-5xl font-extrabold tracking-tight">Policies & Procedures</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                Official guidelines for the LIT Scholarship Program. Please review these policies carefully.
            </p>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">

                {/* Brief Section */}
                <section id="brief">
                    <div className="flex items-start">
                        <FileText className="w-10 h-10 text-primary mr-6 mt-1 flex-shrink-0" />
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Brief</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                The LIT Program, administered by a 501(c)(3) non-profit organization, annually awards a merit-based scholarship to academically outstanding students from all faculties at the university. This scholarship helps awardees in applying for MS/PhD programs at centers/universities of international repute.
                            </p>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Award Benefits */}
                <section id="benefits">
                      <div className="flex items-start">
                        <Award className="w-10 h-10 text-primary mr-6 mt-1 flex-shrink-0" />
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Award Benefits</h2>
                            <p className="text-muted-foreground text-lg mb-4">
                                LIT helps selected awardees with 1-to-1 personalized mentoring and financial support that includes the following:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 text-lg">
                                <li>Preparation material for standardised exams.</li>
                                <li>One out of GRE or GMAT or any other equivalent exam.</li>
                                <li>One out of TOEFL or IELTS.</li>
                                <li>Score reports for up to five universities.</li>
                                <li>Application fees for up to five universities.</li>
                            </ul>
                            <p className="mt-4 text-sm text-muted-foreground">Please note: No cash is given to the student directly. To ensure serious effort, we pay for tests once scholars get a minimum score in at least two practice tests.</p>
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Application Requirements */}
                <section id="requirements">
                    <h2 className="text-3xl font-bold mb-4">Application Requirements</h2>
                    <p className="text-muted-foreground text-lg mb-4">Applications are typically invited in February and results declared in May. The selection is purely merit-based and entails:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 text-lg">
                        <li>Personal information based on a Curriculum Vitae/Resume.</li>
                        {/* FIXED: Escaped single quotes with &apos; */}
                        <li>Copy of mark sheets for all years of bachelor&apos;s and master&apos;s degrees.</li>
                        <li>Copies of co-curricular and extra-curricular certificates.</li>
                        <li>Responses to essay-type questions.</li>
                    </ul>
                </section>

                 <Separator />

                {/* Selection & Mentorship */}
                 <section id="selection">
                    <h2 className="text-3xl font-bold mb-4">Selection & Mentorship</h2>
                    <p className="text-muted-foreground text-lg mb-4">Scholars are selected via a rigorous review by academic experts, followed by interviews. About 25-30 students are awarded scholarships each year. Awardees are paired with expert mentors for personalized guidance. Upon successful admission, students become mentors themselves.</p>
                </section>

                <Separator />

                 {/* Validity & Disqualification */}
                <section id="validity">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <Calendar className="w-8 h-8 text-primary mr-4" />
                                <h3 className="text-2xl font-bold">Validity of the Award</h3>
                            </div>
                            <p className="text-muted-foreground">The award is valid for 1 year from the announcement date. Extensions up to one year may be granted under extenuating circumstances, subject to team approval.</p>
                        </div>
                         <div>
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="w-8 h-8 text-destructive mr-4" />
                                <h3 className="text-2xl font-bold">Conditions for Disqualification</h3>
                            </div>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Submission of fraudulent information or plagiarism.</li>
                                <li>Failure to provide regular progress updates.</li>
                                <li>Participating in similar programs during the award period.</li>
                            </ul>
                        </div>
                    </div>
                </section>
                
                <Separator />
                
                {/* New Policies */}
                <section id="new-policies">
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Info className="w-6 h-6 mr-3 text-primary" />
                                New Policies Starting from 2025
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                            <p><strong>Award Validity:</strong> The award will be for one year (May 2025 to May 2026). Apply only if you can commit at least 4 hours per week to your applications.</p>
                            <p><strong>Probationary Period:</strong> The award will initially be provisional. A 3-4 month probationary period, including progress reviews with mentors, will determine the confirmation of your status and access to financial benefits.</p>
                            <p><strong>Exclusivity:</strong> Awardees are prohibited from participating in or benefiting from programs similar to ours. If financial support has been offered, repayments must be made within one month of award revocation.</p>
                            <p className="font-semibold">The LIT Executive Committee retains sole discretion to revoke any support provided at any time.</p>
                        </CardContent>
                    </Card>
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