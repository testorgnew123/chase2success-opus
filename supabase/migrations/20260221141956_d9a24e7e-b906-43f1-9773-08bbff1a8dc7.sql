
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can log visits" ON public.page_visits;

-- Create a permissive INSERT policy
CREATE POLICY "Anyone can log visits"
ON public.page_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
