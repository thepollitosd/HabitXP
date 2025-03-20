-- First drop the table from the publication if it exists
BEGIN;
  -- Check if the table is in the publication and remove it if it is
  DO $$
  DECLARE
    _publication_tables TEXT[];
  BEGIN
    SELECT array_agg(tablename) INTO _publication_tables
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime';
    
    IF 'users' = ANY(_publication_tables) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE users';
    END IF;
  END
  $$;
  
  -- Now add it back to the publication
  ALTER PUBLICATION supabase_realtime ADD TABLE users;
COMMIT;