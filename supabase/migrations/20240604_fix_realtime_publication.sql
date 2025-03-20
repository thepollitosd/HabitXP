-- Fix the error with the users table already being in the publication
-- First, check if the table is already in the publication before adding it
DO $$
BEGIN
  -- Only add user_profiles and streaks tables to realtime publication
  -- Skip the users table since it's already added
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'streaks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.streaks;
  END IF;
END;
$$;