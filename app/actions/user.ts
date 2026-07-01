"use server"; // 💡 এটি অবশ্যই থাকতে হবে

import { db } from "@/db"; 
import { users } from "@/db/schema"; 
import { currentUser, auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function checkAndSyncUser() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "No userId found in Clerk auth" };

    // ১. আপনার স্কিমা অনুযায়ী `db.select()` কোয়েরি চেক (id কলাম দিয়ে)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // ২. যদি ডাটাবেজে ইউজার না থাকে, তবে নতুন ইউজার ইনসার্ট হবে
    if (existingUser.length === 0) {
      const clerkUser = await currentUser();
      if (!clerkUser) return { success: false, error: "No user found in Clerk" };

      const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
      const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Anonymous User";
      
      const metaRole = clerkUser.unsafeMetadata?.requestedRole;
      const finalRole = metaRole === "lawyer" ? "lawyer" : "client";

      // 💡 আপনার schema.ts এর কলামের নামের সাথে ১০০% নিখুঁত ম্যাচিং:
      await db.insert(users).values({
        id: userId,           // স্কিমাতে text('id')
        name: fullName,       // স্কিমাতে text('name').notNull()
        email: primaryEmail,  // স্কিমাতে text('email').notNull()
        image: clerkUser.imageUrl, // স্কিমাতে text('image')
        role: finalRole,      // স্কিমাতে roleEnum
      });

      console.log(`🆕 User ${primaryEmail} successfully synced to database as ${finalRole}!`);
      return { success: true, isNew: true };
    }

    return { success: true, isNew: false };
  } catch (error: any) {
    console.error("💥 Real Database Error Inside Action:", error); 
    return { success: false, error: error.message || "Failed to sync user" };
  }
}