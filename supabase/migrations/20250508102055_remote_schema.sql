

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."heatmap_rows" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "heatmap_id" "uuid" NOT NULL,
    "order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."heatmap_rows" OWNER TO "postgres";


COMMENT ON TABLE "public"."heatmap_rows" IS 'Stores the definition of each row within a specific user heatmap.';



COMMENT ON COLUMN "public"."heatmap_rows"."id" IS 'Primary key (UUID)';



COMMENT ON COLUMN "public"."heatmap_rows"."heatmap_id" IS 'Foreign key referencing the parent heatmap.';



COMMENT ON COLUMN "public"."heatmap_rows"."order" IS 'Optional sorting order for the rows.';



COMMENT ON COLUMN "public"."heatmap_rows"."created_at" IS 'Timestamp when the row was created.';



CREATE TABLE IF NOT EXISTS "public"."heatmap_squares" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "row_id" "uuid" NOT NULL,
    "position" integer NOT NULL,
    "level" smallint DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "heatmap_squares_level_check" CHECK ((("level" >= 0) AND ("level" <= 3)))
);


ALTER TABLE "public"."heatmap_squares" OWNER TO "postgres";


COMMENT ON TABLE "public"."heatmap_squares" IS 'Stores the state of individual squares within a heatmap row.';



COMMENT ON COLUMN "public"."heatmap_squares"."id" IS 'Primary key (UUID)';



COMMENT ON COLUMN "public"."heatmap_squares"."row_id" IS 'Foreign key referencing the parent heatmap_rows.';



COMMENT ON COLUMN "public"."heatmap_squares"."position" IS 'Sequential position of the square within its row.';



COMMENT ON COLUMN "public"."heatmap_squares"."level" IS 'Color intensity level (0=white, 1=light, 2=medium, 3=dark).';



COMMENT ON COLUMN "public"."heatmap_squares"."created_at" IS 'Timestamp when the square was created.';



CREATE TABLE IF NOT EXISTS "public"."heatmaps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."heatmaps" OWNER TO "postgres";


COMMENT ON TABLE "public"."heatmaps" IS 'Represents a single heatmap owned by a user.';



COMMENT ON COLUMN "public"."heatmaps"."id" IS 'Primary key for the heatmap.';



COMMENT ON COLUMN "public"."heatmaps"."user_id" IS 'Foreign key linking to the user who owns this heatmap. UNIQUE constraint ensures one heatmap per user.';



COMMENT ON COLUMN "public"."heatmaps"."created_at" IS 'Timestamp when the heatmap entry was created.';



ALTER TABLE ONLY "public"."heatmap_rows"
    ADD CONSTRAINT "heatmap_rows_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."heatmap_squares"
    ADD CONSTRAINT "heatmap_squares_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."heatmaps"
    ADD CONSTRAINT "heatmaps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."heatmaps"
    ADD CONSTRAINT "heatmaps_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."heatmap_squares"
    ADD CONSTRAINT "unique_row_position" UNIQUE ("row_id", "position");



CREATE INDEX "idx_heatmap_rows_heatmap_id" ON "public"."heatmap_rows" USING "btree" ("heatmap_id");



CREATE INDEX "idx_heatmap_rows_order" ON "public"."heatmap_rows" USING "btree" ("order");



CREATE INDEX "idx_heatmap_squares_row_id" ON "public"."heatmap_squares" USING "btree" ("row_id");



CREATE INDEX "idx_heatmaps_user_id" ON "public"."heatmaps" USING "btree" ("user_id");



ALTER TABLE ONLY "public"."heatmap_rows"
    ADD CONSTRAINT "heatmap_rows_heatmap_id_fkey" FOREIGN KEY ("heatmap_id") REFERENCES "public"."heatmaps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."heatmap_squares"
    ADD CONSTRAINT "heatmap_squares_row_id_fkey" FOREIGN KEY ("row_id") REFERENCES "public"."heatmap_rows"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."heatmaps"
    ADD CONSTRAINT "heatmaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow user to manage rows in their own heatmap" ON "public"."heatmap_rows" USING ((EXISTS ( SELECT 1
   FROM "public"."heatmaps" "h"
  WHERE (("h"."id" = "heatmap_rows"."heatmap_id") AND ("h"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."heatmaps" "h"
  WHERE (("h"."id" = "heatmap_rows"."heatmap_id") AND ("h"."user_id" = "auth"."uid"())))));



CREATE POLICY "Allow user to manage squares in their own heatmap" ON "public"."heatmap_squares" USING ((EXISTS ( SELECT 1
   FROM ("public"."heatmap_rows" "r"
     JOIN "public"."heatmaps" "h" ON (("r"."heatmap_id" = "h"."id")))
  WHERE (("r"."id" = "heatmap_squares"."row_id") AND ("h"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."heatmap_rows" "r"
     JOIN "public"."heatmaps" "h" ON (("r"."heatmap_id" = "h"."id")))
  WHERE (("r"."id" = "heatmap_squares"."row_id") AND ("h"."user_id" = "auth"."uid"())))));



CREATE POLICY "Allow user to manage their own heatmap" ON "public"."heatmaps" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."heatmap_rows" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."heatmap_squares" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."heatmaps" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON TABLE "public"."heatmap_rows" TO "anon";
GRANT ALL ON TABLE "public"."heatmap_rows" TO "authenticated";
GRANT ALL ON TABLE "public"."heatmap_rows" TO "service_role";



GRANT ALL ON TABLE "public"."heatmap_squares" TO "anon";
GRANT ALL ON TABLE "public"."heatmap_squares" TO "authenticated";
GRANT ALL ON TABLE "public"."heatmap_squares" TO "service_role";



GRANT ALL ON TABLE "public"."heatmaps" TO "anon";
GRANT ALL ON TABLE "public"."heatmaps" TO "authenticated";
GRANT ALL ON TABLE "public"."heatmaps" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
