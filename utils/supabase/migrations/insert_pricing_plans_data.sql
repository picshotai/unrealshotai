-- Insert the two payment plans for dodopayments integration
INSERT INTO public.dodo_pricing_plans (
  name,
  description,
  price,
  credits,
  currency,
  dodo_product_id,
  is_active,
  metadata
) VALUES 
(
  'Basic Pack',
  '30 AI photos, 1 model training included, 20-30 min training time',
  9.99,
  30,
  'USD',
  'basic_pack_30_credits', -- This will be the product ID in dodopayments
  true,
  '{"features": ["30 AI photos", "1 model training included", "20-30 min training time"]}'
),
(
  'Premium Pack',
  '60 AI photos, 2 model training included, 20-30 min training time',
  17.99,
  60,
  'USD',
  'premium_pack_60_credits', -- This will be the product ID in dodopayments
  true,
  '{"features": ["60 AI photos", "2 model training included", "20-30 min training time"]}'
);