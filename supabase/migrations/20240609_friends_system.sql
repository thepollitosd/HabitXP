-- Create friends table
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Create friend requests table
CREATE TABLE IF NOT EXISTS friend_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

-- Function to get friends list
CREATE OR REPLACE FUNCTION get_friends(user_id_param UUID)
RETURNS TABLE (
  friend_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total_xp BIGINT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Friends where user is the requester
  SELECT 
    f.friend_id,
    p.full_name,
    p.avatar_url,
    COALESCE((SELECT SUM(amount) FROM xp WHERE user_id = f.friend_id), 0)::BIGINT as total_xp,
    f.status
  FROM 
    friends f
    LEFT JOIN user_profiles p ON f.friend_id = p.id
  WHERE 
    f.user_id = user_id_param
  UNION
  -- Friends where user is the recipient
  SELECT 
    f.user_id as friend_id,
    p.full_name,
    p.avatar_url,
    COALESCE((SELECT SUM(amount) FROM xp WHERE user_id = f.user_id), 0)::BIGINT as total_xp,
    f.status
  FROM 
    friends f
    LEFT JOIN user_profiles p ON f.user_id = p.id
  WHERE 
    f.friend_id = user_id_param AND f.status = 'accepted'
  ORDER BY
    total_xp DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to search users by username
CREATE OR REPLACE FUNCTION search_users(search_term TEXT, current_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  friendship_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    p.full_name,
    p.avatar_url,
    COALESCE(
      (SELECT status FROM friends 
       WHERE (user_id = current_user_id AND friend_id = u.id) 
          OR (user_id = u.id AND friend_id = current_user_id)
       LIMIT 1
      ),
      'none'
    ) as friendship_status
  FROM 
    auth.users u
    LEFT JOIN user_profiles p ON u.id = p.id
  WHERE 
    u.id != current_user_id AND
    (p.full_name ILIKE '%' || search_term || '%' OR
     u.email ILIKE '%' || search_term || '%')
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to generate invite code
CREATE OR REPLACE FUNCTION generate_friend_invite(user_id_param UUID)
RETURNS TEXT AS $$
DECLARE
  invite_code TEXT;
BEGIN
  -- Generate a random code
  invite_code := encode(gen_random_bytes(8), 'hex');
  
  -- Insert into invites table
  INSERT INTO friend_invites (sender_id, invite_code)
  VALUES (user_id_param, invite_code);
  
  RETURN invite_code;
END;
$$ LANGUAGE plpgsql;

-- Function to accept friend invite
CREATE OR REPLACE FUNCTION accept_friend_invite(invite_code_param TEXT, user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  sender_id UUID;
BEGIN
  -- Get the sender from the invite code
  SELECT sender_id INTO sender_id
  FROM friend_invites
  WHERE invite_code = invite_code_param AND expires_at > NOW();
  
  IF sender_id IS NULL THEN
    RETURN FALSE; -- Invalid or expired code
  END IF;
  
  -- Don't allow self-friending
  IF sender_id = user_id_param THEN
    RETURN FALSE;
  END IF;
  
  -- Check if friendship already exists
  IF EXISTS (
    SELECT 1 FROM friends 
    WHERE (user_id = sender_id AND friend_id = user_id_param) OR
          (user_id = user_id_param AND friend_id = sender_id)
  ) THEN
    RETURN FALSE; -- Already friends or pending
  END IF;
  
  -- Create friendship
  INSERT INTO friends (user_id, friend_id, status)
  VALUES (sender_id, user_id_param, 'accepted');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to send friend request
CREATE OR REPLACE FUNCTION send_friend_request(sender_id UUID, recipient_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Don't allow self-friending
  IF sender_id = recipient_id THEN
    RETURN FALSE;
  END IF;
  
  -- Check if friendship already exists
  IF EXISTS (
    SELECT 1 FROM friends 
    WHERE (user_id = sender_id AND friend_id = recipient_id) OR
          (user_id = recipient_id AND friend_id = sender_id)
  ) THEN
    RETURN FALSE; -- Already friends or pending
  END IF;
  
  -- Create friendship request
  INSERT INTO friends (user_id, friend_id, status)
  VALUES (sender_id, recipient_id, 'pending');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to respond to friend request
CREATE OR REPLACE FUNCTION respond_to_friend_request(user_id_param UUID, requester_id UUID, accept BOOLEAN)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if request exists
  IF NOT EXISTS (
    SELECT 1 FROM friends 
    WHERE user_id = requester_id AND friend_id = user_id_param AND status = 'pending'
  ) THEN
    RETURN FALSE; -- No pending request
  END IF;
  
  -- Update request status
  UPDATE friends
  SET status = CASE WHEN accept THEN 'accepted' ELSE 'rejected' END,
      updated_at = NOW()
  WHERE user_id = requester_id AND friend_id = user_id_param;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add realtime publication for friends tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'friends') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE friends;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'friend_invites') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE friend_invites;
  END IF;
END
$$;