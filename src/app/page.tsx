import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Trophy, GraduationCap, Globe } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-300 mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
            Applications Open for 2025
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
            LIT Scholarship Program
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Empowering the next generation of global leaders through mentorship, financial support, and world-class guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* --- FIX #1: Point to /apply/start --- */}
            <Link href="/apply/start">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg shadow-orange-500/20 transition-all hover:scale-105">
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/resources">
               <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all">
                Explore Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Join LIT?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We don&apos;t just provide funds; we build careers.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">1-on-1 Mentorship</h3>
              <p className="text-slate-600 leading-relaxed">
                Get paired with alumni from top universities like Stanford, MIT, and Oxford who guide you through every step.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Financial Support</h3>
              <p className="text-slate-600 leading-relaxed">
                We cover GRE/TOEFL fees, application costs, and provide guidance on securing full funding abroad.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Exclusive Resources</h3>
              <p className="text-slate-600 leading-relaxed">
                Access a curated library of SOPs, LORs, and interview guides that have a proven track record of success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-blue-900 mb-2">50+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Scholars</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-blue-900 mb-2">$2M+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Scholarships Won</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-blue-900 mb-2">100%</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-blue-900 mb-2">15+</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Impact */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Alumni Network</h2>
            <p className="text-lg text-slate-600">Join a community of scholars making an impact worldwide.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
             <div className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <Image 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80" 
                  alt="Student 1" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                   <p className="text-white font-bold">Sarah Chen</p>
                   <p className="text-white/80 text-sm">MIT, Class of 2024</p>
                </div>
             </div>
             <div className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <Image 
                  src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80" 
                  alt="Student 2" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                   <p className="text-white font-bold">David Okonkwo</p>
                   <p className="text-white/80 text-sm">Stanford, Class of 2023</p>
                </div>
             </div>
             <div className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <Image 
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80" 
                  alt="Student 3" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                   <p className="text-white font-bold">Priya Patel</p>
                   <p className="text-white/80 text-sm">Oxford, Class of 2025</p>
                </div>
             </div>
             <div className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <Image 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80" 
                  alt="Student 4" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                   <p className="text-white font-bold">James Smith</p>
                   <p className="text-white/80 text-sm">Harvard, Class of 2024</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-900 text-white text-center">
        <div className="container mx-auto px-4">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 text-blue-300" />
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Applications for the 2025 cohort are now open. Don&apos;t miss your chance to be part of something extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* --- FIX #2: Point to /apply/start --- */}
            <Link href="/apply/start">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-white text-blue-900 hover:bg-blue-50 font-bold">
                Apply Now
              </Button>
            </Link>
            
            <Link href="/policies">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 border-blue-400 text-blue-100 hover:bg-blue-800 hover:text-white">
                Read Eligibility
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
           <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4 text-white">
                 <Globe className="h-6 w-6" />
                 <span className="font-bold text-xl">LIT Scholarship</span>
              </div>
              <p className="max-w-sm mb-6">
                A non-profit initiative dedicated to helping meritorious students achieve their dreams of higher education abroad.
              </p>
           </div>
           
           <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                 <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                 <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                 <li><Link href="/mentorship" className="hover:text-white transition-colors">Mentorship</Link></li>
                 <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
           </div>
           
           <div>
               <h4 className="font-bold text-white mb-4">Contact</h4>
               <ul className="space-y-2">
                 <li>Email: support@litscholarship.org</li>
                 <li>Phone: +1 (555) 123-4567</li>
                 <li>Address: 123 Education Lane, Tech City</li>
               </ul>
           </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
           © {new Date().getFullYear()} LIT Scholarship Program. All rights reserved.
        </div>
      </footer>
    </div>
  );
}