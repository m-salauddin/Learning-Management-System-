-- Drop the internal coupon constraint / references from transactions first
ALTER TABLE public.transactions DROP COLUMN IF EXISTS coupon_id;
ALTER TABLE public.transactions DROP COLUMN IF EXISTS coupon_code;

-- Then easily wipe out the coupons collection entirely
DROP TABLE IF EXISTS public.coupons CASCADE;
