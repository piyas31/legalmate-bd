"use server";

import { db } from "@/db";
import { lawyerProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ১. ভেরিফিকেশন পেন্ডিং থাকা সকল লয়ারদের লিস্ট আনা
export async function getPendingLawyers() {
  try {
    const pendingLawyers = await db
      .select({
        profileId: lawyerProfiles.id,
        barCouncilNo: lawyerProfiles.barCouncilNo,
        specialty: lawyerProfiles.specialty,
        experienceYrs: lawyerProfiles.experienceYrs,
        hourlyRate: lawyerProfiles.hourlyRate,
        bio: lawyerProfiles.bio,
        userName: users.name,
        userEmail: users.email,
        userImage: users.image,
      })
      .from(lawyerProfiles)
      .innerJoin(users, eq(lawyerProfiles.userId, users.id))
      .where(eq(lawyerProfiles.isVerified, false));

    return { success: true, data: pendingLawyers };
  } catch (error: any) {
    console.error("💥 Failed to fetch pending lawyers:", error);
    return { success: false, error: error.message };
  }
}

// ২. লয়ারের প্রোফাইল এপ্রুভ (Verify) করা
export async function approveLawyerProfile(profileId: string) {
  try {
    await db
      .update(lawyerProfiles)
      .set({ isVerified: true })
      .where(eq(lawyerProfiles.id, profileId));

    // ড্যাশবোর্ডের ক্যাশ ক্লিয়ার করা যাতে লয়ার সাথে সাথে এপ্রুভাল দেখতে পায়
    revalidatePath("/lawyer-dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("💥 Failed to approve lawyer:", error);
    return { success: false, error: error.message };
  }
}

// 🛑 ৩. লয়ারের প্রোফাইল ডিক্লাইন (রিসেট/ডিলিট) করা
export async function declineLawyerProfile(profileId: string) {
  try {
    // ডাটাবেজ থেকে লয়ারের এই পেন্ডিং প্রোফাইল রো-টি মুছে ফেলা হচ্ছে
    // এর ফলে লয়ার যখন তার পোর্টালে ঢুকবে, সে আবার নতুন করে অনবোর্ডিং ফর্ম দেখতে পাবে
    await db
      .delete(lawyerProfiles)
      .where(eq(lawyerProfiles.id, profileId));

    // লয়ার ড্যাশবোর্ডের ক্যাশ ব্রেক করা
    revalidatePath("/lawyer-dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("💥 Failed to decline lawyer:", error);
    return { success: false, error: error.message };
  }
}