drop policy "Allow user to manage rows in their own heatmap" on "public"."heatmap_rows";

drop policy "Allow user to manage squares in their own heatmap" on "public"."heatmap_squares";

drop policy "Allow user to manage their own heatmap" on "public"."heatmaps";

revoke delete on table "public"."heatmap_rows" from "anon";

revoke insert on table "public"."heatmap_rows" from "anon";

revoke references on table "public"."heatmap_rows" from "anon";

revoke select on table "public"."heatmap_rows" from "anon";

revoke trigger on table "public"."heatmap_rows" from "anon";

revoke truncate on table "public"."heatmap_rows" from "anon";

revoke update on table "public"."heatmap_rows" from "anon";

revoke delete on table "public"."heatmap_rows" from "authenticated";

revoke insert on table "public"."heatmap_rows" from "authenticated";

revoke references on table "public"."heatmap_rows" from "authenticated";

revoke select on table "public"."heatmap_rows" from "authenticated";

revoke trigger on table "public"."heatmap_rows" from "authenticated";

revoke truncate on table "public"."heatmap_rows" from "authenticated";

revoke update on table "public"."heatmap_rows" from "authenticated";

revoke delete on table "public"."heatmap_rows" from "service_role";

revoke insert on table "public"."heatmap_rows" from "service_role";

revoke references on table "public"."heatmap_rows" from "service_role";

revoke select on table "public"."heatmap_rows" from "service_role";

revoke trigger on table "public"."heatmap_rows" from "service_role";

revoke truncate on table "public"."heatmap_rows" from "service_role";

revoke update on table "public"."heatmap_rows" from "service_role";

revoke delete on table "public"."heatmap_squares" from "anon";

revoke insert on table "public"."heatmap_squares" from "anon";

revoke references on table "public"."heatmap_squares" from "anon";

revoke select on table "public"."heatmap_squares" from "anon";

revoke trigger on table "public"."heatmap_squares" from "anon";

revoke truncate on table "public"."heatmap_squares" from "anon";

revoke update on table "public"."heatmap_squares" from "anon";

revoke delete on table "public"."heatmap_squares" from "authenticated";

revoke insert on table "public"."heatmap_squares" from "authenticated";

revoke references on table "public"."heatmap_squares" from "authenticated";

revoke select on table "public"."heatmap_squares" from "authenticated";

revoke trigger on table "public"."heatmap_squares" from "authenticated";

revoke truncate on table "public"."heatmap_squares" from "authenticated";

revoke update on table "public"."heatmap_squares" from "authenticated";

revoke delete on table "public"."heatmap_squares" from "service_role";

revoke insert on table "public"."heatmap_squares" from "service_role";

revoke references on table "public"."heatmap_squares" from "service_role";

revoke select on table "public"."heatmap_squares" from "service_role";

revoke trigger on table "public"."heatmap_squares" from "service_role";

revoke truncate on table "public"."heatmap_squares" from "service_role";

revoke update on table "public"."heatmap_squares" from "service_role";

revoke delete on table "public"."heatmaps" from "anon";

revoke insert on table "public"."heatmaps" from "anon";

revoke references on table "public"."heatmaps" from "anon";

revoke select on table "public"."heatmaps" from "anon";

revoke trigger on table "public"."heatmaps" from "anon";

revoke truncate on table "public"."heatmaps" from "anon";

revoke update on table "public"."heatmaps" from "anon";

revoke delete on table "public"."heatmaps" from "authenticated";

revoke insert on table "public"."heatmaps" from "authenticated";

revoke references on table "public"."heatmaps" from "authenticated";

revoke select on table "public"."heatmaps" from "authenticated";

revoke trigger on table "public"."heatmaps" from "authenticated";

revoke truncate on table "public"."heatmaps" from "authenticated";

revoke update on table "public"."heatmaps" from "authenticated";

revoke delete on table "public"."heatmaps" from "service_role";

revoke insert on table "public"."heatmaps" from "service_role";

revoke references on table "public"."heatmaps" from "service_role";

revoke select on table "public"."heatmaps" from "service_role";

revoke trigger on table "public"."heatmaps" from "service_role";

revoke truncate on table "public"."heatmaps" from "service_role";

revoke update on table "public"."heatmaps" from "service_role";

alter table "public"."heatmap_rows" drop constraint "heatmap_rows_heatmap_id_fkey";

alter table "public"."heatmap_squares" drop constraint "heatmap_squares_level_check";

alter table "public"."heatmap_squares" drop constraint "heatmap_squares_row_id_fkey";

alter table "public"."heatmap_squares" drop constraint "unique_row_position";

alter table "public"."heatmaps" drop constraint "heatmaps_user_id_fkey";

alter table "public"."heatmaps" drop constraint "heatmaps_user_id_key";

alter table "public"."heatmap_rows" drop constraint "heatmap_rows_pkey";

alter table "public"."heatmap_squares" drop constraint "heatmap_squares_pkey";

alter table "public"."heatmaps" drop constraint "heatmaps_pkey";

drop index if exists "public"."heatmap_rows_pkey";

drop index if exists "public"."heatmap_squares_pkey";

drop index if exists "public"."heatmaps_pkey";

drop index if exists "public"."heatmaps_user_id_key";

drop index if exists "public"."idx_heatmap_rows_heatmap_id";

drop index if exists "public"."idx_heatmap_rows_order";

drop index if exists "public"."idx_heatmap_squares_row_id";

drop index if exists "public"."idx_heatmaps_user_id";

drop index if exists "public"."unique_row_position";

drop table "public"."heatmap_rows";

drop table "public"."heatmap_squares";

drop table "public"."heatmaps";