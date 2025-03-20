-- First, check if the token_identifier column exists and has a not-null constraint
DO $$
BEGIN
  -- If the column exists and has a not-null constraint, make it nullable
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'token_identifier'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.users ALTER COLUMN token_identifier DROP NOT NULL;
  END IF;

  -- If the column doesn't exist, add it as nullable
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'token_identifier'
  ) THEN
    ALTER TABLE public.users ADD COLUMN token_identifier TEXT;
  END IF;
END
$$;

-- Update the handle_new_user function to handle the token_identifier column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, token_identifier)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.email -- Using email as a fallback for token_identifier
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
