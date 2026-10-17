import React from 'react';

interface WelcomeEmailProps {
  applicantName: string;
  applicantEmail: string;
  tempPassword: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  applicantName,
  applicantEmail,
  tempPassword,
}) => {
  // Use your environment variable, or fallback to localhost for dev
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return (
    <div>
      <h1>Welcome to the LIT Scholarship Portal, {applicantName}!</h1>
      <p>
        Your application has been approved. Congratulations!
      </p>
      <p>
        You can now log in to the portal as an awardee using the following
        credentials. We strongly recommend you change your password after
        your first login.
      </p>
      <ul>
        <li><strong>Email:</strong> {applicantEmail}</li>
        <li><strong>Temporary Password:</strong> {tempPassword}</li>
      </ul>
      <p>
        {/* Dynamic Link */}
        Click here to log in: <a href={`${baseUrl}/login/awardee`}>Portal Login</a>
      </p>
      <p>
        We look forward to having you as part of our community.
      </p>
    </div>
  );
};

export function renderWelcomeEmailHtml({
  applicantName,
  applicantEmail,
  tempPassword,
}: WelcomeEmailProps): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h1 style="color: #1e3a8a; font-size: 24px; font-weight: 700; margin-bottom: 16px;">
        Welcome to the LIT Scholarship Portal, ${applicantName}!
      </h1>
      <p style="font-size: 16px; margin-bottom: 16px;">
        Your application has been approved. Congratulations!
      </p>
      <p style="font-size: 15px; margin-bottom: 16px;">
        You can now log in to the portal as an awardee using the following credentials. We strongly recommend you change your password after your first login.
      </p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 4px 0; font-size: 15px;"><strong>Email:</strong> ${applicantEmail}</p>
        <p style="margin: 4px 0; font-size: 15px;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${tempPassword}</code></p>
      </div>

      <p style="margin: 24px 0;">
        <a href="${baseUrl}/login/awardee" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
          Log In to Portal
        </a>
      </p>

      <p style="color: #64748b; font-size: 14px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        We look forward to having you as part of our community.
      </p>
    </div>
  `;
}

export default WelcomeEmail;