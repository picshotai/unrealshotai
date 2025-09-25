-- Add auto_extend column to models table
-- This column tracks if the user enabled auto-extension during model training
-- If enabled, the model won't be automatically deleted when it expires

ALTER TABLE public.models 
ADD COLUMN auto_extend boolean DEFAULT false;

-- Add comment to explain the column purpose
COMMENT ON COLUMN public.models.auto_extend IS 'If true, the model will be automatically extended when it expires. Costs 2 additional credits.';