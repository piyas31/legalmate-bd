"use server";

import { db } from "@/db"; 
import { appointments, users, lawyerProfiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

/**
 * 🚀 কারেন্ট লগইন থাকা ক্লায়েন্টের সব অ্যাপয়েন্টমেন্ট লাইভ ডাটাবেজ থেকে নিয়ে আসা
 */
export async function getClientAppointments() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("Unauthorized access. Please sign in.");
    }

    // 🔥 leftJoin ব্যবহার করা হলো যাতে appointments টেবিল ফাঁকা (Empty) থাকলেও ক্র্যাশ না করে
    const liveData = await db
      .select({
        id: appointments.id,
        scheduledAt: appointments.scheduledAt,
        status: appointments.status,
        paymentStatus: appointments.paymentStatus,
        videoRoomId: appointments.videoRoomId,
        specialty: lawyerProfiles.specialty,
        hourlyRate: lawyerProfiles.hourlyRate,
        lawyerName: users.name, 
      })
      .from(appointments)
      .where(eq(appointments.clientId, userId))
      // 💡 innerJoin এর বদলে leftJoin যাতে ফাঁকা ডেটাতেও সেফ থাকে
      .leftJoin(lawyerProfiles, eq(appointments.lawyerProfileId, lawyerProfiles.id))
      .leftJoin(users, eq(lawyerProfiles.userId, users.id))
      .orderBy(desc(appointments.createdAt));

    // যদি কোনো ডাটা না থাকে, তবে সেফলি খালি অ্যারে রিটার্ন করবে
    return liveData || [];

  } catch (error) {
    console.error("💥 Core LeftJoin Query Failed:", error);
    // ডেভেলপমেন্টের সুবিধার্থে আসল এররটা ফ্রন্টএন্ডে পাস করে দিচ্ছি যাতে অন্ধের মতো খুঁজতে না হয়
    throw new Error(error instanceof Error ? error.message : "Failed to load appointments");
  }
}