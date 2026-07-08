ALTER TYPE "public"."user_role" ADD VALUE 'admin';--> statement-breakpoint
ALTER TABLE "appointments" RENAME COLUMN "lawyer_id" TO "lawyer_profile_id";--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_lawyer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_client_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "video_room_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lawyer_profile_id_lawyer_profiles_id_fk" FOREIGN KEY ("lawyer_profile_id") REFERENCES "public"."lawyer_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;