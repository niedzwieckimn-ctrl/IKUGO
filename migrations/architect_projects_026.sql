-- LOCAL FILE ONLY. Requires existing architect program and portal migrations 001-023.
-- Private planning data; no orders, inventory, commission or B2B policy changes.
begin;
create table public.architect_projects (
 id uuid primary key default gen_random_uuid(),
 architect_id uuid not null references public.architect_profiles(id),
 name text not null check(length(btrim(name)) between 1 and 120),
 archived boolean not null default false,
 preferred_variant_id uuid,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index on public.architect_projects(architect_id,updated_at desc);
create table public.architect_project_variants (
 id uuid primary key default gen_random_uuid(), project_id uuid not null references public.architect_projects(id) on delete cascade,
 name text not null check(length(btrim(name)) between 1 and 120), created_at timestamptz not null default now()
);
create index on public.architect_project_variants(project_id);
alter table public.architect_projects add foreign key(preferred_variant_id) references public.architect_project_variants(id) on delete set null;
create table public.architect_project_items (
 variant_id uuid not null references public.architect_project_variants(id) on delete cascade,
 product_id bigint not null references public.products(id), quantity integer not null check(quantity between 1 and 9999),
 saved_unit_cents bigint not null check(saved_unit_cents between 1 and 1000000000),
 primary key(variant_id,product_id)
);
-- Separate private table: never append notes to architect_codes returned to B2B.
create table public.architect_code_notes (
 code_id uuid primary key references public.architect_codes(id) on delete cascade, request_id uuid,
 architect_id uuid not null references public.architect_profiles(id),
 note text not null default '' check(length(note)<=240),
 project_id uuid references public.architect_projects(id),
 variant_id uuid references public.architect_project_variants(id), updated_at timestamptz not null default now(),
 check(variant_id is null or project_id is not null), unique(architect_id,request_id)
);
create index on public.architect_code_notes(architect_id);
create or replace function architect_portal.projects_allowed() returns boolean
 language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.architect_profiles p join auth.users u on u.id=p.id
 where p.id=auth.uid() and p.status='approved' and u.email_confirmed_at is not null);
$$;
revoke all on function architect_portal.projects_allowed() from public,anon;
grant usage on schema architect_portal to authenticated;
grant execute on function architect_portal.projects_allowed() to authenticated;
alter table public.architect_projects enable row level security;
alter table public.architect_project_variants enable row level security;
alter table public.architect_project_items enable row level security;
alter table public.architect_code_notes enable row level security;
create policy projects_owner_read on public.architect_projects for select to authenticated
 using(architect_id=auth.uid() and architect_portal.projects_allowed());
create policy variants_owner_read on public.architect_project_variants for select to authenticated
 using(exists(select 1 from public.architect_projects p where p.id=project_id));
create policy items_owner_read on public.architect_project_items for select to authenticated
 using(exists(select 1 from public.architect_project_variants v where v.id=variant_id));
create policy notes_owner_read on public.architect_code_notes for select to authenticated
 using(architect_id=auth.uid() and architect_portal.projects_allowed());
revoke all on public.architect_projects,public.architect_project_variants,public.architect_project_items,public.architect_code_notes from anon,authenticated;
grant select on public.architect_projects,public.architect_project_variants,public.architect_project_items,public.architect_code_notes to authenticated;
grant all on public.architect_projects,public.architect_project_variants,public.architect_project_items,public.architect_code_notes to service_role;

create or replace function public.architect_projects_request(p_action text,p_data jsonb default '{}')
returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid=auth.uid(); pid uuid; vid uuid; cid uuid; pr public.architect_projects%rowtype;
 result jsonb; catalog jsonb; product jsonb; cents bigint; qty integer; nm text;
begin
 if not architect_portal.projects_allowed() then raise exception 'Potwierdź e-mail i poczekaj na zatwierdzenie konta.' using errcode='42501'; end if;
 if jsonb_typeof(p_data) is distinct from 'object' or octet_length(p_data::text)>8192 then raise exception 'Nieprawidłowe dane'; end if;
 -- Serialize an architect's planning mutations and limit duplicate creation retries.
 perform 1 from public.architect_profiles where id=uid for update;
 if p_action='list' then
   select coalesce(jsonb_agg(to_jsonb(p) order by p.updated_at desc),'[]') into result from public.architect_projects p where architect_id=uid;
   return jsonb_build_object('projects',result);
 end if;
 if p_action='notes' then
   select coalesce(jsonb_agg(to_jsonb(n)),'[]') into result from public.architect_code_notes n where architect_id=uid;
   return jsonb_build_object('notes',result);
 end if;
 if p_action='create' then
   nm=btrim(p_data->>'name'); pid=(p_data->>'id')::uuid;
   if pid is null or nm is null then raise exception 'Podaj nazwę projektu'; end if;
   if exists(select 1 from public.architect_projects where id=pid and architect_id=uid) then return jsonb_build_object('id',pid); end if;
   if (select count(*) from public.architect_projects where architect_id=uid)>=500 then raise exception 'Osiągnięto limit projektów'; end if;
   insert into public.architect_projects(id,architect_id,name) values(pid,uid,nm);
   insert into public.architect_project_variants(project_id,name) values(pid,'Wariant A');
   return jsonb_build_object('id',pid);
 end if;
 pid=nullif(p_data->>'project_id','')::uuid;
 vid=nullif(p_data->>'variant_id','')::uuid;
 if pid is not null then
   select * into pr from public.architect_projects where id=pid and architect_id=uid for update;
   if not found then raise exception 'Projekt niedostępny' using errcode='42501'; end if;
   if vid is not null and not exists(select 1 from public.architect_project_variants where id=vid and project_id=pid) then raise exception 'Wariant niedostępny' using errcode='42501'; end if;
 elsif vid is not null then raise exception 'Wybierz projekt'; end if;
 if p_action='get' then
   if pid is null then raise exception 'Wybierz projekt'; end if;
   -- Reuse existing public retail catalog, never a second price list.
   catalog=architect_portal.catalog('pln',true);
   select coalesce(jsonb_agg(to_jsonb(v)||jsonb_build_object('items',(
     select coalesce(jsonb_agg(jsonb_build_object('product_id',i.product_id,'quantity',i.quantity,
       'saved_unit_cents',i.saved_unit_cents,'unit_cents',
       case when (c->>'retail_gross_pln')::numeric>0 then round((c->>'retail_gross_pln')::numeric*100)::bigint else null end
       ) order by i.product_id),'[]')
     from public.architect_project_items i left join lateral
       (select value c from jsonb_array_elements(catalog) where (value->>'product_id')::bigint=i.product_id) x on true
     where i.variant_id=v.id
   )) order by v.created_at,v.id),'[]') into result from public.architect_project_variants v where v.project_id=pid;
   return jsonb_build_object('project',to_jsonb(pr),'variants',result);
 end if;
 if p_action in ('note_save','create_code') then
   if length(coalesce(p_data->>'note',''))>240 then raise exception 'Opis może mieć maksymalnie 240 znaków'; end if;
   if p_action='create_code' then
     if nullif(p_data->>'request_id','') is null then raise exception 'Brak identyfikatora próby'; end if;
     select code_id into cid from public.architect_code_notes where architect_id=uid and request_id=(p_data->>'request_id')::uuid;
     if found then return jsonb_build_object('ok',true,'code',(select jsonb_build_object('id',c.id,'code',c.code) from public.architect_codes c where c.id=cid)); end if;
     if pid is not null and pr.archived then raise exception 'Projekt jest zarchiwizowany'; end if;
     -- Existing server rate limit, issue-code rules, validity and commission unchanged.
     result=architect_portal.request('architect.create_code',jsonb_build_object('distributor_id',p_data->'distributor_id'));
     if result->>'ok' is distinct from 'true' then return result; end if;
     cid=(result->'code'->>'id')::uuid;
   else cid=(p_data->>'code_id')::uuid; end if;
   if not exists(select 1 from public.architect_codes where id=cid and architect_id=uid) then raise exception 'Kod niedostępny' using errcode='42501'; end if;
   insert into public.architect_code_notes(code_id,architect_id,note,project_id,variant_id,request_id)
     values(cid,uid,coalesce(p_data->>'note',''),pid,vid,case when p_action='create_code' then (p_data->>'request_id')::uuid else null end)
     on conflict(code_id) do update set note=excluded.note,project_id=excluded.project_id,variant_id=excluded.variant_id,updated_at=now();
   return coalesce(result,jsonb_build_object('ok',true));
 end if;
 if pid is null then raise exception 'Wybierz projekt'; end if;
 if pr.archived then raise exception 'Projekt jest zarchiwizowany'; end if;
 case p_action
 when 'rename' then update public.architect_projects set name=btrim(p_data->>'name') where id=pid;
 when 'archive' then update public.architect_projects set archived=true where id=pid;
 when 'variant_create' then
   if (select count(*) from public.architect_project_variants where project_id=pid)>=20 then raise exception 'Maksymalnie 20 wariantów'; end if;
   vid=(p_data->>'id')::uuid;
   insert into public.architect_project_variants(id,project_id,name) values(vid,pid,btrim(p_data->>'name')) on conflict(id) do nothing;
   if not exists(select 1 from public.architect_project_variants where id=vid and project_id=pid) then raise exception 'Wariant niedostępny'; end if;
 when 'variant_rename' then
   if vid is null then raise exception 'Wybierz wariant'; end if;
   update public.architect_project_variants set name=btrim(p_data->>'name') where id=vid;
 when 'prefer' then
   if vid is null then raise exception 'Wybierz wariant'; end if;
   update public.architect_projects set preferred_variant_id=vid where id=pid;
 when 'item_save' then
   if vid is null then raise exception 'Wybierz wariant'; end if;
   qty=(p_data->>'quantity')::integer;
   if qty is null or qty not between 1 and 9999 then raise exception 'Ilość od 1 do 9999'; end if;
   catalog=architect_portal.catalog('pln',true);
   select value into product from jsonb_array_elements(catalog) where value->>'product_id'=p_data->>'product_id';
   cents=round((product->>'retail_gross_pln')::numeric*100)::bigint;
   if cents is null or cents<=0 or cents>1000000000 then raise exception 'Produkt lub cena niedostępna'; end if;
   if not exists(select 1 from public.architect_project_items where variant_id=vid and product_id=(p_data->>'product_id')::bigint)
      and (select count(*) from public.architect_project_items where variant_id=vid)>=100 then raise exception 'Maksymalnie 100 pozycji w wariancie'; end if;
   insert into public.architect_project_items values(vid,(p_data->>'product_id')::bigint,qty,cents)
      on conflict(variant_id,product_id) do update set quantity=excluded.quantity,saved_unit_cents=excluded.saved_unit_cents;
 when 'item_remove' then delete from public.architect_project_items where variant_id=vid and product_id=(p_data->>'product_id')::bigint;
 else raise exception 'Nieznana operacja';
 end case;
 update public.architect_projects set updated_at=now() where id=pid;
 return jsonb_build_object('ok',true,'id',coalesce(vid,pid));
end $$;
revoke all on function public.architect_projects_request(text,jsonb) from public,anon;
grant execute on function public.architect_projects_request(text,jsonb) to authenticated;
notify pgrst,'reload schema';
commit;
