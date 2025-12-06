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

export default WelcomeEmail;