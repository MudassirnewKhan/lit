import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CreatePostForm from '@/components/feed/CreatePostForm';
import LoadMorePosts from '@/components/feed/LoadMorePosts';
import { getMeetings } from '@/app/mentorship/actions';
import { getInitials, getRoleBadge } from '@/lib/utils';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Video, 
  ExternalLink, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Attachment = {
  url: string;
  type: string;
  name: string;
};

async function getInitialPosts() {
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { 
          id: true, 
          firstName: true, 
          lastName: true, 
          roles: { select: { role: true } } 
        },
      },
      comments: {
        include: { 
          author: { 
            select: { 
              id: true, 
              firstName: true, 
              lastName: true, 
              roles: { select: { role: true } } 
            } 
          } 
        },
        orderBy: { createdAt: 'asc' }
      }
    },
  });

  return posts.map(post => ({
    ...post,
    attachments: (post.attachments as unknown as Attachment[]) || [],
    author: {
      id: post.author.id,
      name: `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || 'Community Member',
      roles: post.author.roles.map(r => r.role),
    },
    comments: post.comments.map(c => ({
      ...c,
      author: {
        id: c.author.id,
        name: `${c.author.firstName || ''} ${c.author.lastName || ''}`.trim() || 'Community Member',
        roles: c.author.roles.map(r => r.role),
      }
    }))
  }));
}

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login/awardee');
  }

  // 1. Fetch Posts
  const initialPosts = await getInitialPosts();
  const roles = session.user.roles || [];
  const canModerate = roles.includes('admin') || roles.includes('subadmin');

  // 2. Fetch User Profile Details from DB
  const userDetails = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      department: true,
      batchYear: true,
    }
  });

  const fullName = `${userDetails?.firstName || session.user.name || 'Scholar'}`.trim();
  const userRole = getRoleBadge(roles);

  // 3. Fetch Mentorship Sessions for Current User
  let upcomingSessions: any[] = [];
  try {
    const allMeetings = await getMeetings();
    const now = new Date();
    // Show upcoming sessions scheduled within the last 2 hours or in the future
    upcomingSessions = allMeetings
      .filter((m: any) => new Date(m.scheduledAt).getTime() >= now.getTime() - 1000 * 60 * 60 * 2)
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching meetings for feed:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Community Feed</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connect, collaborate, and share updates across the LIT community.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="bg-white">
              <Link href="/mentorship">
                <Video className="w-4 h-4 mr-1.5 text-purple-600" />
                Mentorship Hub
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white">
              <Link href="/resources">
                <BookOpen className="w-4 h-4 mr-1.5 text-indigo-600" />
                Resources
              </Link>
            </Button>
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Feed Column (Left, 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Create Post Form */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5">
              <CreatePostForm currentUser={{ name: fullName, roles }} />
            </div>

            {/* Posts Stream */}
            <div className="space-y-4">
              <LoadMorePosts 
                initialPosts={initialPosts} 
                currentUserId={session.user.id}
                isAdmin={canModerate} 
              />
            </div>
          </div>

          {/* Sidebar Column (Right, 4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Profile Snapshot Card */}
            <Card className="bg-white border-gray-200/80 shadow-xs">
              <CardHeader className="pb-3 pt-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-sm">
                    {getInitials(fullName)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 leading-tight">{fullName}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${userRole.colorClass}`}>
                        {userRole.label}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 pt-1 text-xs text-gray-600">
                {(userDetails?.department || userDetails?.batchYear) && (
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    {userDetails?.department && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="truncate">{userDetails.department}</span>
                      </div>
                    )}
                    {userDetails?.batchYear && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Class of {userDetails.batchYear}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <Button asChild variant="ghost" size="sm" className="w-full text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-50 justify-between h-8 px-2">
                    <Link href="/profile">
                      Edit Profile & Settings
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 2. Upcoming Mentorship Sessions Widget */}
            <Card className="bg-white border-gray-200/80 shadow-xs">
              <CardHeader className="pb-3 pt-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      Upcoming Sessions
                    </CardTitle>
                  </div>
                  <Link href="/mentorship" className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                    View All →
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Video className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-700">No sessions scheduled right now</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      New workshops & 1-on-1s will appear here automatically.
                    </p>
                    <Button asChild variant="outline" size="sm" className="mt-3 text-xs h-7">
                      <Link href="/mentorship">Explore Mentorship Hub</Link>
                    </Button>
                  </div>
                ) : (
                  upcomingSessions.map((session: any) => {
                    const sessionDate = new Date(session.scheduledAt);

                    return (
                      <div 
                        key={session.id} 
                        className="p-3 rounded-lg border border-gray-100 bg-slate-50/70 hover:bg-purple-50/50 hover:border-purple-200 transition-colors space-y-2"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-semibold text-xs text-gray-900 line-clamp-1">
                            {session.title}
                          </h4>
                          {session.targetBatch && (
                            <span className="shrink-0 text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-medium">
                              {session.targetBatch}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-gray-600">
                          <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span>
                            {sessionDate.toLocaleDateString(undefined, { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })} • {sessionDate.toLocaleTimeString(undefined, { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>

                        {session.mentor && (
                          <p className="text-[11px] text-gray-500">
                            Host: <span className="font-medium text-gray-700">{session.mentor.firstName} {session.mentor.lastName}</span>
                          </p>
                        )}

                        <div className="pt-1">
                          <a
                            href={session.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center w-full gap-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md py-1.5 px-3 text-xs font-medium transition-colors shadow-2xs"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Join Session
                            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* 3. Community Highlights Card */}
            <Card className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white shadow-xs border-0">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  LIT Scholar Community
                </div>
                <h4 className="text-sm font-semibold text-white">
                  Empower each other to Lead, Ignite & Transform.
                </h4>
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  Share your achievements, academic questions, and career milestones. Mentors and staff are here to support your journey.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}