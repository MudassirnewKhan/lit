import { getMeetings } from './actions';
import CreateMeetingForm from '@/components/mentorship/CreateMeetingForm';
import DeleteMeetingButton from '@/components/mentorship/DeleteMeetingButton'; // <--- Import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Clock, Video, User } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';

export default async function MentorshipPage() {
  const user = await getCurrentUser();
  const meetings = await getMeetings();

  if (!user) return null;

  // Roles check
  const isStaff = user.roles.some(r => ['admin', 'subadmin', 'mentor', 'sponsor'].includes(r));
  const isAdmin = user.roles.some(r => ['admin', 'subadmin'].includes(r));

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentorship Hub</h1>
          <p className="text-muted-foreground">Join upcoming sessions or schedule new ones.</p>
        </div>
        
        {/* Only Mentors/Admins can schedule */}
        {isStaff && <CreateMeetingForm />}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
        
        {meetings.length === 0 ? (
          <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => {
              // LOGIC: Show Delete if User is Admin OR User is the Creator
              const isCreator = meeting.mentorId === user.id;
              const canDelete = isAdmin || isCreator;

              return (
                <Card key={meeting.id} className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow relative">
                  
                  {/* --- DELETE BUTTON (Top Right) --- */}
                  {canDelete && (
                    <div className="absolute top-2 right-2">
                      <DeleteMeetingButton meetingId={meeting.id} />
                    </div>
                  )}
                  {/* -------------------------------- */}

                  <CardHeader className="pb-2 pr-10"> {/* Added pr-10 to prevent text overlapping button */}
                    <div className="flex flex-col gap-2 items-start">
                      <CardTitle className="text-lg leading-tight">{meeting.title}</CardTitle>
                      
                      {/* Badge Logic */}
                      {meeting.targetBatch ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Class of {meeting.targetBatch}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Public
                        </span>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2 mt-2">
                      {meeting.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm">
                    {/* Host Info */}
                    <div className="flex items-center text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      <span>Hosted by {meeting.mentor?.firstName || "Mentor"} {meeting.mentor?.lastName}</span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>
                        {new Date(meeting.scheduledAt).toLocaleDateString('en-US', { 
                          weekday: 'short', month: 'short', day: 'numeric' 
                        })}
                      </span>
                      <Clock className="ml-3 mr-2 h-4 w-4" />
                      <span>
                        {new Date(meeting.scheduledAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', minute: '2-digit' 
                        })}
                      </span>
                    </div>

                    {/* Join Button */}
                    <div className="pt-2">
                      <a 
                        href={meeting.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Join Meeting
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}