-- Enable RLS on auth.users table
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to select their own data" ON auth.users;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own data" ON auth.users;
DROP POLICY IF EXISTS "Allow authenticated users to update their own data" ON auth.users;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own data" ON auth.users;

-- Create policies for auth.users table
-- Allow authenticated users to select their own data
CREATE POLICY "Allow authenticated users to select their own data" 
ON auth.users 
FOR SELECT 
TO authenticated 
USING (id = auth.uid());

-- Allow authenticated users to insert their own data
CREATE POLICY "Allow authenticated users to insert their own data" 
ON auth.users 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users to update their own data
CREATE POLICY "Allow authenticated users to update their own data" 
ON auth.users 
FOR UPDATE 
TO authenticated 
USING (id = auth.uid()) 
WITH CHECK (true);

-- Allow authenticated users to delete their own data
CREATE POLICY "Allow authenticated users to delete their own data" 
ON auth.users 
FOR DELETE 
TO authenticated 
USING (id = auth.uid());
