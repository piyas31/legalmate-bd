CREATE TYPE "public"."user_role" AS ENUM('client', 'lawyer');--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('pending', 'accepted', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" text NOT NULL,
	"lawyer_id" text NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"status" "appointment_status" DEFAULT 'pending' NOT NULL,
	"video_room_id" text NOT NULL,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lawyer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"bar_council_no" text NOT NULL,
	"specialty" text NOT NULL,
	"bio" text,
	"experience_yrs" integer NOT NULL,
	"hourly_rate" numeric(10, 2) NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0.00',
	CONSTRAINT "lawyer_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "lawyer_profiles_bar_council_no_unique" UNIQUE("bar_council_no")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'client' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lawyer_id_users_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyer_profiles" ADD CONSTRAINT "lawyer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;