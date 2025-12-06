import React from 'react';
import { prisma } from '@/lib/prisma';
import ApplicationsClientPage from './ApplicationsClientPage'; // We will create this next

// This is a SERVER COMPONENT. Its only job is to fetch data.
const getPendingApplications = async () => {
  try {
    const applications = await prisma.application.findMany({
      where: { status: 'pending' },
      orderBy: { submittedAt: 'desc' },
    });
    // We must convert Date objects to a string to pass them to a Client Component.
    return applications.map(app => ({
        ...app,
        submittedAt: app.submittedAt.toISOString(), 
    }));
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return [];
  }
};

export default async function ApplicationsPage() {
  // 1. Fetch the data on the server.
  const applications = await getPendingApplications();

  // 2. Render the CLIENT component and pass the data to it as a prop.
  return <ApplicationsClientPage initialApplications={applications} />;
}