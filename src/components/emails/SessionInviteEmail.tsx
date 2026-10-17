export interface SessionInviteEmailProps {
  title: string;
  description?: string | null;
  link: string;
  scheduledAt: Date | string;
  mentorName: string;
  targetBatch?: string | null;
  targetDepartment?: string | null;
}

export function renderSessionInviteEmailHtml({
  title,
  description,
  link,
  scheduledAt,
  mentorName,
  targetBatch,
  targetDepartment,
}: SessionInviteEmailProps): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const meetingDate = new Date(scheduledAt);
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = meetingDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const audienceParts: string[] = [];
  if (targetBatch && targetBatch !== 'all') {
    audienceParts.push(`Class of ${targetBatch}`);
  } else {
    audienceParts.push('All Batches');
  }

  if (targetDepartment && targetDepartment !== 'all') {
    audienceParts.push(targetDepartment);
  } else {
    audienceParts.push('All Departments');
  }

  const audienceLabel = audienceParts.join(' • ');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #7e22ce; color: #ffffff; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 700;">📅 New Mentorship Session Scheduled</h2>
        <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">LIT Scholarship Mentorship Hub</p>
      </div>

      <h1 style="color: #1e3a8a; font-size: 22px; font-weight: 700; margin: 0 0 12px 0;">
        ${title}
      </h1>

      <p style="font-size: 15px; color: #475569; margin-bottom: 20px;">
        A new live mentorship session has been scheduled for your cohort by <strong>${mentorName}</strong>.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 130px;"><strong>Host:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${mentorName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Date:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Time:</strong></td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${formattedTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;"><strong>Audience:</strong></td>
            <td style="padding: 6px 0; color: #7e22ce; font-weight: 600;">${audienceLabel}</td>
          </tr>
        </table>

        ${
          description
            ? `
          <div style="margin-top: 14px; border-top: 1px dashed #cbd5e1; padding-top: 12px;">
            <p style="margin: 0 0 4px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Agenda / Details:</p>
            <p style="margin: 0; color: #334155; font-size: 14px; white-space: pre-wrap;">${description}</p>
          </div>
        `
            : ''
        }
      </div>

      <div style="text-align: center; margin: 28px 0 20px 0;">
        <a href="${link}" style="display: inline-block; background-color: #7e22ce; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          🎥 Join Meeting (Google Meet / Zoom)
        </a>
      </div>

      <p style="text-align: center; font-size: 14px; color: #64748b;">
        Or view all upcoming sessions in your <a href="${baseUrl}/mentorship" style="color: #2563eb; text-decoration: underline;">Mentorship Hub</a>.
      </p>

      <p style="color: #94a3b8; font-size: 13px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center;">
        You received this notification because you are an active scholar in the LIT Scholarship Program.
      </p>
    </div>
  `;
}

