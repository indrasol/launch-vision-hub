
-- Create ideas table for storing ideas
CREATE TABLE public.ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  username TEXT NOT NULL,
  idea TEXT NOT NULL,
  num_votes INTEGER NOT NULL DEFAULT 0
);

-- Create idea_votes table for tracking individual votes
CREATE TABLE public.idea_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Using session ID or device fingerprint since no auth
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(idea_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_votes ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for public access (since this is a voting app)
CREATE POLICY "Allow public read access on ideas" 
  ON public.ideas 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert on ideas" 
  ON public.ideas 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read access on votes" 
  ON public.idea_votes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert/update on votes" 
  ON public.idea_votes 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create function to handle vote updates
CREATE OR REPLACE FUNCTION public.handle_vote(
  p_idea_id UUID,
  p_user_id TEXT,
  p_value INTEGER
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_vote INTEGER;
  new_total INTEGER;
BEGIN
  -- Check for existing vote
  SELECT value INTO existing_vote 
  FROM public.idea_votes 
  WHERE idea_id = p_idea_id AND user_id = p_user_id;
  
  IF existing_vote IS NULL THEN
    -- Insert new vote
    INSERT INTO public.idea_votes (idea_id, user_id, value)
    VALUES (p_idea_id, p_user_id, p_value);
  ELSIF existing_vote = p_value THEN
    -- Remove vote (toggle off)
    DELETE FROM public.idea_votes 
    WHERE idea_id = p_idea_id AND user_id = p_user_id;
  ELSE
    -- Update existing vote
    UPDATE public.idea_votes 
    SET value = p_value, created_at = now()
    WHERE idea_id = p_idea_id AND user_id = p_user_id;
  END IF;
  
  -- Update vote count in ideas table
  SELECT COALESCE(SUM(value), 0) INTO new_total
  FROM public.idea_votes 
  WHERE idea_id = p_idea_id;
  
  UPDATE public.ideas 
  SET num_votes = new_total
  WHERE id = p_idea_id;
  
  RETURN json_build_object(
    'success', true,
    'new_total', new_total,
    'user_vote', CASE 
      WHEN existing_vote IS NULL THEN p_value
      WHEN existing_vote = p_value THEN NULL
      ELSE p_value
    END
  );
END;
$$;

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.idea_votes;
