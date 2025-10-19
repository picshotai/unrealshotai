-- Add trial_preview_used column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN trial_preview_used boolean NOT NULL DEFAULT false;

-- Create index for faster queries on trial status
CREATE INDEX profiles_trial_preview_used_idx ON public.profiles (trial_preview_used);