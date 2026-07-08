"use server";

import { db } from "@/db";
import { users, lawyerProfiles, appointments } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createLawyerProfile(data: any) {
  try {
    await db.insert(lawyerProfiles).values({
      userId: data.userId,
      barCouncilNo: data.barCouncilNo,
      specialty: data.specialty,
      experienceYrs: data.experienceYrs, 
      hourlyRate: data.hourlyRate,       
      bio: data.bio,
      isVerified: false, 
    });

    revalidatePath("/lawyer-dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to insert lawyer profile:", error);
    return { success: false, error: error.message };
  }
}
export async function approveAppointment(appointmentId: string) {
  try {
    await db
      .update(appointments)
      .set({ status: "accepted" }) // বা আপনার ডাটাবেজে যে স্ট্যাটাস টেক্সট সেভ করেন (যেমন: "confirmed")
      .where(eq(appointments.id, appointmentId));

    revalidatePath("/lawyer-dashboard");
    revalidatePath("/client-dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve appointment:", error);
    return { success: false, error: "Failed to approve appointment" };
  }
}

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

export async function getLawyers() {
  try {
    const data = await db
      .select({
        id: lawyerProfiles.id,
        name: users.name,
        image: users.image,
        specialty: lawyerProfiles.specialty,
        experienceYrs: lawyerProfiles.experienceYrs,
        hourlyRate: lawyerProfiles.hourlyRate,
        rating: lawyerProfiles.rating,
        isVerified: lawyerProfiles.isVerified,
      })
      .from(lawyerProfiles)
      .innerJoin(users, eq(lawyerProfiles.userId, users.id))
      .where(eq(lawyerProfiles.isVerified, true)); 

    return data;
  } catch (error) {
    console.error("Error fetching lawyers directory:", error);
    return [];
  }
}

export async function getLawyerById(profileId: string) {
  try {
    const data = await db
      .select({
        id: lawyerProfiles.id,
        name: users.name,
        image: users.image,
        email: users.email,
        specialty: lawyerProfiles.specialty,
        bio: lawyerProfiles.bio,
        experienceYrs: lawyerProfiles.experienceYrs,
        hourlyRate: lawyerProfiles.hourlyRate,
        rating: lawyerProfiles.rating,
        barCouncilNo: lawyerProfiles.barCouncilNo,
      })
      .from(lawyerProfiles)
      .innerJoin(users, eq(lawyerProfiles.userId, users.id))
      .where(eq(lawyerProfiles.id, profileId))
      .limit(1);

    return data[0] || null;
  } catch (error) {
    console.error("Error fetching lawyer profile:", error);
    return null;
  }
}

export async function createAppointment(formData: {
  lawyerProfileId: string;
  scheduledAt: Date;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Authentication required. Please log in." };
    }

    const newApt = await db.insert(appointments).values({
      clientId: userId, 
      lawyerProfileId: formData.lawyerProfileId,
      scheduledAt: formData.scheduledAt,
      status: "pending",
      paymentStatus: "unpaid",
      videoRoomId: `room-${Math.random().toString(36).substring(2, 11)}`, 
    }).returning({ id: appointments.id });

    revalidatePath("/dashboard");
    return { success: true, appointmentId: newApt[0].id };
  } catch (error: any) {
    console.error("Live Booking Insertion Failed:", error);
    return { success: false, error: error.message || "Failed to process booking request" };
  }
}

// ==========================================
// 👔 নতুন অ্যাকশন: লয়ারের নিজস্ব অ্যাপয়েন্টমেন্ট নিয়ে আসা
// ==========================================
export async function getLawyerAppointments() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    // লয়ারের প্রোফাইল UUID বের করা
    const [lawyerProf] = await db
      .select({ id: lawyerProfiles.id })
      .from(lawyerProfiles)
      .where(eq(lawyerProfiles.userId, userId))
      .limit(1);

    if (!lawyerProf) return [];

    // লয়ারের নিজস্ব প্রোফাইল আইডির সাথে ম্যাচ করা সব অ্যাপয়েন্টমেন্ট রিড করা
    const data = await db
      .select({
        id: appointments.id,
        scheduledAt: appointments.scheduledAt,
        status: appointments.status,
        paymentStatus: appointments.paymentStatus,
        clientName: users.name, 
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.clientId, users.id)) 
      .where(eq(appointments.lawyerProfileId, lawyerProf.id))
      .orderBy(desc(appointments.createdAt));

    return data;
  } catch (error) {
    console.error("Error fetching lawyer appointments:", error);
    return [];
  }
}

// ==========================================
// ❌ নতুন অ্যাকশন: অ্যাপয়েন্টমেন্ট ক্যানসেল করা
// ==========================================
export async function cancelAppointment(appointmentId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    await db
      .update(appointments)
      .set({ status: "cancelled" })
      .where(eq(appointments.id, appointmentId));

    revalidatePath("/dashboard");
    revalidatePath("/lawyer-dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Cancel Appointment Failed:", error);
    return { success: false, error: error.message };
  }
}