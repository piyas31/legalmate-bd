import { pgTable, text, timestamp, pgEnum, integer, boolean, decimal, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ১. ইউজার রোল এবং অ্যাপয়েন্টমেন্ট স্ট্যাটাসের জন্য এনাম (Enum)
export const roleEnum = pgEnum('user_role', ['client', 'lawyer']);
export const statusEnum = pgEnum('appointment_status', ['pending', 'accepted', 'completed', 'cancelled']);

// ২. কোর ইউজার টেবিল (Clerk-এর সাথে সিঙ্কড থাকবে)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk User ID সরাসরি এখানে বসবে
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image'),
  role: roleEnum('role').default('client').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ৩. আইনজীবী প্রোফাইল টেবিল (One-to-One with Users)
export const lawyerProfiles = pgTable('lawyer_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  barCouncilNo: text('bar_council_no').notNull().unique(),
  specialty: text('specialty').notNull(), // e.g., 'Corporate', 'Criminal'
  bio: text('bio'),
  experienceYrs: integer('experience_yrs').notNull(),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }).notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
});

// ৪. অ্যাপয়েন্টমেন্ট টেবিল (Relations with Clients and Lawyers)
export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: text('client_id').references(() => users.id).notNull(),
  lawyerId: text('lawyer_id').references(() => users.id).notNull(), // লয়ারের ইউজার আইডি
  scheduledAt: timestamp('scheduled_at').notNull(),
  status: statusEnum('status').default('pending').notNull(),
  videoRoomId: text('video_room_id').notNull(), // WebRTC সেশন ট্র্যাকিং
  paymentStatus: text('payment_status').default('unpaid').notNull(), // Escrow ট্র্যাকিং
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  lawyerProfile: one(lawyerProfiles),
  appointmentsAsClient: many(appointments, { relationName: 'clientAppointments' }),
  appointmentsAsLawyer: many(appointments, { relationName: 'lawyerAppointments' }),
}));

export const lawyerProfilesRelations = relations(lawyerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [lawyerProfiles.userId],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  client: one(users, {
    fields: [appointments.clientId],
    references: [users.id],
    relationName: 'clientAppointments',
  }),
  lawyer: one(users, {
    fields: [appointments.lawyerId],
    references: [users.id],
    relationName: 'lawyerAppointments',
  }),
}));