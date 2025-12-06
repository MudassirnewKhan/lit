// File Path: prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // Ensure this is bcryptjs

const prisma = new PrismaClient();

async function main() {
  console.log('--- RUNNING FINAL SEED SCRIPT ---');

  const adminEmail = 'admin@litprogram.uni';
  
  // --- CRITICAL CHANGE: Use a simple, temporary password for this test ---
  const adminPassword = 'khanmk1234';
  console.log(`Preparing to set password for ${adminEmail} to: "${adminPassword}"`);

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  console.log('Password has been securely hashed with bcryptjs.');

  // This 'upsert' will FIND your existing admin by email and UPDATE their password hash.
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'User',
      passwordHash: hashedPassword,
      roles: {
        create: { role: 'admin' },
      },
    },
  });

  console.log(`✅ Admin user's password has been successfully reset: ${adminUser.email}`);
  console.log('---------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });