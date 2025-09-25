-- Create profiles for existing users who don't have them
INSERT INTO public.profiles (id, user_id, has_completed_onboarding)
SELECT 
    id,
    id as user_id,
    false as has_completed_onboarding
FROM auth.users 
WHERE id NOT IN (
    SELECT user_id FROM public.profiles
);

-- Add some helpful indexes for debugging
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles (user_id);
CREATE INDEX IF NOT EXISTS profiles_onboarding_idx ON public.profiles (has_completed_onboarding);