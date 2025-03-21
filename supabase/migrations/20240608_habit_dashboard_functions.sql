-- Create function to get total XP for a user
CREATE OR REPLACE FUNCTION get_total_xp(user_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total
  FROM xp
  WHERE user_id = user_id_param;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Create function to update streak
CREATE OR REPLACE FUNCTION update_streak(user_id_param UUID)
RETURNS TABLE(current_streak INTEGER, longest_streak INTEGER) AS $$
DECLARE
  streak_record RECORD;
  today DATE := CURRENT_DATE;
BEGIN
  -- Check if streak record exists
  SELECT * INTO streak_record FROM streaks WHERE user_id = user_id_param;
  
  IF NOT FOUND THEN
    -- Create new streak record
    INSERT INTO streaks (user_id, current_streak, longest_streak, last_completed_date)
    VALUES (user_id_param, 1, 1, today)
    RETURNING current_streak, longest_streak INTO current_streak, longest_streak;
  ELSE
    -- Update existing streak
    IF streak_record.last_completed_date = today - INTERVAL '1 day' THEN
      -- Consecutive day
      UPDATE streaks
      SET 
        current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_completed_date = today
      WHERE user_id = user_id_param
      RETURNING current_streak, longest_streak INTO current_streak, longest_streak;
    ELSIF streak_record.last_completed_date < today - INTERVAL '1 day' THEN
      -- Streak broken
      UPDATE streaks
      SET 
        current_streak = 1,
        last_completed_date = today
      WHERE user_id = user_id_param
      RETURNING current_streak, longest_streak INTO current_streak, longest_streak;
    ELSIF streak_record.last_completed_date = today THEN
      -- Already completed today
      SELECT streak_record.current_streak, streak_record.longest_streak INTO current_streak, longest_streak;
    END IF;
  END IF;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Create function to get weekly leaderboard
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(limit_param INTEGER)
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total_xp BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    p.full_name,
    p.avatar_url,
    COALESCE(SUM(x.amount), 0)::BIGINT as total_xp
  FROM 
    auth.users u
    LEFT JOIN user_profiles p ON u.id = p.id
    LEFT JOIN xp x ON u.id = x.user_id AND x.created_at >= (CURRENT_DATE - INTERVAL '7 days')
  GROUP BY 
    u.id, p.full_name, p.avatar_url
  ORDER BY 
    total_xp DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to get monthly leaderboard
CREATE OR REPLACE FUNCTION get_monthly_leaderboard(limit_param INTEGER)
RETURNS TABLE(
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total_xp BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as user_id,
    p.full_name,
    p.avatar_url,
    COALESCE(SUM(x.amount), 0)::BIGINT as total_xp
  FROM 
    auth.users u
    LEFT JOIN user_profiles p ON u.id = p.id
    LEFT JOIN xp x ON u.id = x.user_id AND x.created_at >= (CURRENT_DATE - INTERVAL '30 days')
  GROUP BY 
    u.id, p.full_name, p.avatar_url
  ORDER BY 
    total_xp DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- Add realtime publication for habit tables (only if not already added)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'habits') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE habits;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'habit_completions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE habit_completions;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'streaks') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE streaks;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'xp') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE xp;
  END IF;
END
$$;