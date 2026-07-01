"use server";

import { db } from "@/db";
import { lawyerProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ১. আপনার আগের ক্রিয়েট প্রোফাইল অ্যাকশন (এখানে revalidatePath নিশ্চিত করুন)
export async function createLawyerProfile(data: any) {
  try {
    // ... আপনার প্রোফাইল ইনসার্ট কোড ...
    
    revalidatePath("/lawyer-dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 🚀 ২. এই নতুন অ্যাকশনটি হুবহু কপি করে ফাইলের নিচে বসিয়ে দিন ভাই (ক্যাশ ব্রেকার মেকানিজম)
export async function getLawyerProfileStatus(userId: string) {
  try {
    const [profile] = await db
      .select()
      .from(lawyerProfiles)
      .where(eq(lawyerProfiles.userId, userId))
      .limit(1);

    if (profile) {
      return {
        exists: true,
        isVerified: profile.isVerified,
        profile: profile
      };
    }

    return { exists: false, isVerified: false, profile: null };
  } catch (error) {
    console.error("Error fetching lawyer status directly:", error);
    return { exists: false, isVerified: false, profile: null };
  }
}