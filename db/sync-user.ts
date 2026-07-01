"use server";

import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db'; 
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function checkAndSyncUser() {
  console.log("🚀 [SYNC-USER] Function triggered!"); // লগ ১
  
  const { userId } = await auth();
  console.log("🆔 [SYNC-USER] Clerk userId:", userId); // লগ ২
  if (!userId) return null;

  try {
    // ১. ডাটাবেজে ইউজার আছে কি না চেক
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    
    console.log("🔍 [SYNC-USER] Existing user found in DB?", !!existingUser); // লগ ৩

    // ২. যদি ডাটাবেজে না থাকে
    if (!existingUser) {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        console.log("❌ [SYNC-USER] Clerk user data is empty!");
        return null;
      }

      const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
      const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Anonymous User';
      const metaRole = clerkUser.publicMetadata?.requestedRole || clerkUser.unsafeMetadata?.requestedRole;
      const finalRole = metaRole === 'lawyer' ? 'lawyer' : 'client';

      console.log("📝 [SYNC-USER] Ready to insert:", { id: userId, email: primaryEmail, role: finalRole }); // লগ ৪

      // NeonDB-তে ডাটা পুশ
      const [newUser] = await db.insert(users).values({
        id: userId,
        name: fullName,
        email: primaryEmail,
        image: clerkUser.imageUrl,
        role: finalRole,
      }).returning();

      console.log("🎉 [SYNC-USER] INSERT SUCCESSFUL!", newUser); // লগ ৫
      return newUser;
    }

    return existingUser;
  } catch (dbError: any) {
    // 💥 এই ক্যাচ ব্লকটা আপনার পুরো প্রজেক্টের আসল সত্যটা টার্মিনালে উগরে দেবে!
    console.error("💥 [CRITICAL DB ERROR]:", dbError);
    throw dbError; // এররটা থ্রো করে দিচ্ছি যাতে ড্যাশবোর্ডও দেখতে পায়
  }
}