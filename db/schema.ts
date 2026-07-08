import { pgTable, text, timestamp, pgEnum, integer, boolean, decimal, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('user_role', ['client', 'lawyer', 'admin']);
export const statusEnum = pgEnum('appointment_status', ['pending', 'accepted', 'completed', 'cancelled']);

// ২. কোর ইউজার টেবিল (Clerk-এর সাথে সিঙ্কড)
export const users = pgTable('users', {
  id: text('id').primaryKey(), 
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image'),
  role: roleEnum("role").notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ৩. আইনজীবী প্রোফাইল টেবিল (One-to-One with Users)
export const lawyerProfiles = pgTable('lawyer_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  barCouncilNo: text('bar_council_no').notNull().unique(),
  specialty: text('specialty').notNull(), 
  bio: text('bio'),
  experienceYrs: integer('experience_yrs').notNull(),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }).notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
});

// ৪. অ্যাপয়েন্টমেন্ট টেবিল (Relations ফিক্স করা হলো)
export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: text('client_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  lawyerProfileId: uuid('lawyer_profile_id').references(() => lawyerProfiles.id, { onDelete: 'cascade' }).notNull(), // 🔥 লয়ার প্রোফাইলের UUID এর সাথে লিঙ্ক করা হলো
  scheduledAt: timestamp('scheduled_at').notNull(),
  status: statusEnum('status').default('pending').notNull(),
  videoRoomId: text('video_room_id'), // 🔥 এটিকে nullable করা হলো, কল এপ্রুভ হলে জেনারেট হবে
  paymentStatus: text('payment_status').default('unpaid').notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ৫. রিলেশনস ম্যাপিং (১০০% টাইপ-সেফ)
export const usersRelations = relations(users, ({ one, many }) => ({
  lawyerProfile: one(lawyerProfiles),
  appointmentsAsClient: many(appointments, { relationName: 'clientAppointments' }),
}));

export const lawyerProfilesRelations = relations(lawyerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [lawyerProfiles.userId],
    references: [users.id],
  }),
  appointmentsAsLawyer: many(appointments, { relationName: 'lawyerAppointments' }), // 🔥 লয়ার প্রোফাইলের আন্ডারে অ্যাপয়েন্টমেন্ট
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  client: one(users, {
    fields: [appointments.clientId],
    references: [users.id],
    relationName: 'clientAppointments',
  }),
  lawyerProfile: one(lawyerProfiles, {
    fields: [appointments.lawyerProfileId],
    references: [lawyerProfiles.id],
    relationName: 'lawyerAppointments',
  }),
}));