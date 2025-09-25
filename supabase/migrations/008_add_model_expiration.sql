-- Add expires_at column to models table
-- This tracks when a model should be automatically deleted if auto_extend is false
ALTER TABLE public.models 
ADD COLUMN expires_at timestamp with time zone;

-- Set expiration based on auto_extend setting for existing models
-- Default: 14 days, Auto-extend: 30 days
UPDATE public.models 
SET expires_at = CASE 
  WHEN auto_extend = true THEN created_at + INTERVAL '30 days'
  ELSE created_at + INTERVAL '14 days'
END
WHERE expires_at IS NULL;

-- Add comment to explain the column purpose
COMMENT ON COLUMN public.models.expires_at IS 'When the model expires and should be deleted if auto_extend is false. Models are kept for 14 days by default, 30 days if auto_extend is enabled.';

-- Create index for efficient cleanup queries
CREATE INDEX idx_models_expiration ON public.models(expires_at, auto_extend) WHERE status = 'finished';