-- Restores legacy access for an EXISTING distributor identified by the verified
-- Auth email. No new customer, approval screen, broad RLS grant or program opt-in.
-- Apply after the existing portal dispatcher (017 or later). Independent of 025/026.
begin;
create or replace function architect_portal.bind_existing_distributor()
returns void language plpgsql security definer set search_path='' as $$
declare uid uuid=auth.uid(); verified_email text; cid bigint; matches integer;
begin
 if uid is null then raise exception 'Zaloguj się ponownie' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtext('b2b-existing-account'),hashtext(uid::text));
 -- An explicit existing administrative decision always takes precedence.
 if exists(select 1 from public.client_accounts where user_id=uid) then
   if (select count(*) from public.client_accounts where user_id=uid and is_active)<>1 then
     raise exception 'Dostęp B2B jest wyłączony lub przypisanie jest niejednoznaczne' using errcode='42501'; end if;
   return;
 end if;
 -- Read identity only from Auth, never from request data or editable metadata.
 select lower(btrim(email)) into verified_email from auth.users
   where id=uid and email_confirmed_at is not null;
 if nullif(verified_email,'') is null then raise exception 'Potwierdź adres e-mail konta dystrybutora' using errcode='42501'; end if;
 if exists(select 1 from public.architect_profiles where id=uid) then
   raise exception 'To konto należy do Panelu Architekta' using errcode='42501'; end if;
 select count(*),min(id) into matches,cid from public.customers where lower(btrim(email))=verified_email;
 if matches<>1 then raise exception 'Nie znaleziono jednoznacznej istniejącej kartoteki dystrybutora dla adresu tego konta' using errcode='42501'; end if;
 -- This records the pre-existing email/customer relationship for the current
 -- ID-based API and private Storage policies. It is not an administrator review.
 insert into public.client_accounts(user_id,customer_id,is_active) values(uid,cid,true);
end $$;
revoke all on function architect_portal.bind_existing_distributor() from public,anon,authenticated;

create or replace function public.portal_request(p_action text,p_data jsonb default '{}')
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if p_action in ('b2b.profile','b2b.catalog','b2b.quote','b2b.create_order','b2b.orders','b2b.order','b2b.sales','b2b.confirm_sale','b2b.invoices','b2b.invoice_seen','b2b.invoice_file','b2b.image','b2b.search','b2b.aliases')
   and jsonb_typeof(p_data)='object' and octet_length(p_data::text)<=65536 then
   begin
     perform architect_portal.bind_existing_distributor();
   exception when insufficient_privilege then
     return jsonb_build_object('ok',false,'status',403,'error',sqlerrm);
   end;
 end if;
 -- Preserve the existing per-action limits, ownership checks and business rules.
 return architect_portal.request(p_action,p_data);
end $$;
revoke all on function public.portal_request(text,jsonb) from public,anon,authenticated;
grant execute on function public.portal_request(text,jsonb) to authenticated;
notify pgrst,'reload schema';
commit;
