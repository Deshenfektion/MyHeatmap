create table "public"."heatmaps" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "label" character varying
);


alter table "public"."heatmaps" enable row level security;

create table "public"."squares" (
    "id" uuid not null default gen_random_uuid(),
    "level" smallint not null default 0,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "date" timestamp without time zone
);


alter table "public"."squares" enable row level security;

CREATE UNIQUE INDEX heatmap_squares_pkey ON public.squares USING btree (id);

CREATE UNIQUE INDEX heatmaps_pkey ON public.heatmaps USING btree (id);

CREATE UNIQUE INDEX heatmaps_user_id_key ON public.heatmaps USING btree (user_id);

CREATE INDEX idx_heatmaps_user_id ON public.heatmaps USING btree (user_id);

alter table "public"."heatmaps" add constraint "heatmaps_pkey" PRIMARY KEY using index "heatmaps_pkey";

alter table "public"."squares" add constraint "heatmap_squares_pkey" PRIMARY KEY using index "heatmap_squares_pkey";

alter table "public"."heatmaps" add constraint "heatmaps_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."heatmaps" validate constraint "heatmaps_user_id_fkey";

alter table "public"."heatmaps" add constraint "heatmaps_user_id_key" UNIQUE using index "heatmaps_user_id_key";

alter table "public"."squares" add constraint "heatmap_squares_level_check" CHECK (((level >= 0) AND (level <= 3))) not valid;

alter table "public"."squares" validate constraint "heatmap_squares_level_check";

grant delete on table "public"."heatmaps" to "anon";

grant insert on table "public"."heatmaps" to "anon";

grant references on table "public"."heatmaps" to "anon";

grant select on table "public"."heatmaps" to "anon";

grant trigger on table "public"."heatmaps" to "anon";

grant truncate on table "public"."heatmaps" to "anon";

grant update on table "public"."heatmaps" to "anon";

grant delete on table "public"."heatmaps" to "authenticated";

grant insert on table "public"."heatmaps" to "authenticated";

grant references on table "public"."heatmaps" to "authenticated";

grant select on table "public"."heatmaps" to "authenticated";

grant trigger on table "public"."heatmaps" to "authenticated";

grant truncate on table "public"."heatmaps" to "authenticated";

grant update on table "public"."heatmaps" to "authenticated";

grant delete on table "public"."heatmaps" to "service_role";

grant insert on table "public"."heatmaps" to "service_role";

grant references on table "public"."heatmaps" to "service_role";

grant select on table "public"."heatmaps" to "service_role";

grant trigger on table "public"."heatmaps" to "service_role";

grant truncate on table "public"."heatmaps" to "service_role";

grant update on table "public"."heatmaps" to "service_role";

grant delete on table "public"."squares" to "anon";

grant insert on table "public"."squares" to "anon";

grant references on table "public"."squares" to "anon";

grant select on table "public"."squares" to "anon";

grant trigger on table "public"."squares" to "anon";

grant truncate on table "public"."squares" to "anon";

grant update on table "public"."squares" to "anon";

grant delete on table "public"."squares" to "authenticated";

grant insert on table "public"."squares" to "authenticated";

grant references on table "public"."squares" to "authenticated";

grant select on table "public"."squares" to "authenticated";

grant trigger on table "public"."squares" to "authenticated";

grant truncate on table "public"."squares" to "authenticated";

grant update on table "public"."squares" to "authenticated";

grant delete on table "public"."squares" to "service_role";

grant insert on table "public"."squares" to "service_role";

grant references on table "public"."squares" to "service_role";

grant select on table "public"."squares" to "service_role";

grant trigger on table "public"."squares" to "service_role";

grant truncate on table "public"."squares" to "service_role";

grant update on table "public"."squares" to "service_role";

create policy "Allow user to manage their own heatmap"
on "public"."heatmaps"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



