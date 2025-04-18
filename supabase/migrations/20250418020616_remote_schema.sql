

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


CREATE TABLE IF NOT EXISTS "public"."clicks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "row" integer NOT NULL,
    "col" integer NOT NULL,
    "clicks" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."clicks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."heatmap_data" (
    "id" integer NOT NULL,
    "user_id" "uuid" NOT NULL,
    "row" integer NOT NULL,
    "col" integer NOT NULL,
    "click" integer NOT NULL
);


ALTER TABLE "public"."heatmap_data" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."heatmap_data_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."heatmap_data_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."heatmap_data_id_seq" OWNED BY "public"."heatmap_data"."id";



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."heatmap_data" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."heatmap_data_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."clicks"
    ADD CONSTRAINT "clicks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clicks"
    ADD CONSTRAINT "clicks_user_id_row_col_key" UNIQUE ("user_id", "row", "col");



ALTER TABLE ONLY "public"."heatmap_data"
    ADD CONSTRAINT "heatmap_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."heatmap_data"
    ADD CONSTRAINT "heatmap_data_user_id_row_col_key" UNIQUE ("user_id", "row", "col");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clicks"
    ADD CONSTRAINT "clicks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."clicks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON TABLE "public"."clicks" TO "anon";
GRANT ALL ON TABLE "public"."clicks" TO "authenticated";
GRANT ALL ON TABLE "public"."clicks" TO "service_role";



GRANT ALL ON TABLE "public"."heatmap_data" TO "anon";
GRANT ALL ON TABLE "public"."heatmap_data" TO "authenticated";
GRANT ALL ON TABLE "public"."heatmap_data" TO "service_role";



GRANT ALL ON SEQUENCE "public"."heatmap_data_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."heatmap_data_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."heatmap_data_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









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
