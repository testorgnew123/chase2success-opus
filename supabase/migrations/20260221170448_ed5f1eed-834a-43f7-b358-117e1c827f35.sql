-- Drop the restrictive INSERT policy and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can log visits" ON public.page_visits;

CREATE POLICY "Anyone can log visits"
ON public.page_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
