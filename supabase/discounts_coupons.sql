-- 1. Course Discount Model
CREATE TABLE IF NOT EXISTS public.course_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  course_id UUID NOT NULL
    REFERENCES public.courses(id)
    ON DELETE CASCADE,

  type TEXT CHECK (type IN ('percentage', 'fixed')) NOT NULL,
  value INT NOT NULL, -- percentage (0–100) or fixed amount

  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Coupon Code Model
CREATE TABLE IF NOT EXISTS public.coupon_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  code TEXT UNIQUE NOT NULL,        -- "SAVE50"
  type TEXT CHECK (type IN ('percentage', 'fixed')) NOT NULL,
  value INT NOT NULL,

  max_uses INT,                     -- NULL = unlimited
  used_count INT DEFAULT 0,

  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Coupon -> Course Mapping
CREATE TABLE IF NOT EXISTS public.coupon_courses (
  coupon_id UUID
    REFERENCES public.coupon_codes(id)
    ON DELETE CASCADE,

  course_id UUID
    REFERENCES public.courses(id)
    ON DELETE CASCADE,

  PRIMARY KEY (coupon_id, course_id)
);

-- 4. Enable RLS
ALTER TABLE public.course_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_courses ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Discounts
DROP POLICY IF EXISTS "Admin manage discounts" ON public.course_discounts;
CREATE POLICY "Admin manage discounts"
ON public.course_discounts
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public read active discounts" ON public.course_discounts;
CREATE POLICY "Public read active discounts"
ON public.course_discounts
FOR SELECT
USING (
  is_active = true
  AND (starts_at IS NULL OR now() >= starts_at)
  AND (ends_at IS NULL OR now() <= ends_at)
);

-- Coupons
DROP POLICY IF EXISTS "Admin manage coupons" ON public.coupon_codes;
CREATE POLICY "Admin manage coupons"
ON public.coupon_codes
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Coupon-course mapping
DROP POLICY IF EXISTS "Admin manage coupon courses" ON public.coupon_courses;
CREATE POLICY "Admin manage coupon courses"
ON public.coupon_courses
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6. RPC Function for Price Calculation
CREATE OR REPLACE FUNCTION public.calculate_course_price(
  p_course_id UUID,
  p_coupon_code TEXT DEFAULT NULL
)
RETURNS TABLE (
  original_price INT,
  discount_amount INT,
  final_price INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  base_price INT;
  discount_value INT := 0;
  v_coupon_id UUID;
  v_coupon_type TEXT;
  v_coupon_value INT;
  v_coupon_max_uses INT;
  v_coupon_used_count INT;
BEGIN
  -- Fetch base price
  SELECT price INTO base_price FROM public.courses
  WHERE id = p_course_id;

  IF base_price IS NULL THEN
     RAISE EXCEPTION 'Course not found';
  END IF;

  -- 1. Apply Automatic Course Discount
  DECLARE
    v_disc_type TEXT;
    v_disc_val INT;
  BEGIN
    SELECT type, value INTO v_disc_type, v_disc_val
    FROM public.course_discounts
    WHERE course_id = p_course_id
      AND is_active = true
      AND (starts_at IS NULL OR now() >= starts_at)
      AND (ends_at IS NULL OR now() <= ends_at)
    ORDER BY created_at DESC -- Prefer most recent if multiple (though rules say only one active)
    LIMIT 1;

    IF v_disc_type IS NOT NULL THEN
       IF v_disc_type = 'percentage' THEN
          discount_value := (base_price * v_disc_val / 100);
       ELSE
          discount_value := v_disc_val;
       END IF;
    END IF;
  END;

  -- 2. Apply Coupon Code (if provided)
  IF p_coupon_code IS NOT NULL THEN
    SELECT id, type, value, max_uses, used_count 
    INTO v_coupon_id, v_coupon_type, v_coupon_value, v_coupon_max_uses, v_coupon_used_count
    FROM public.coupon_codes
    WHERE code = p_coupon_code
      AND is_active = true
      AND (starts_at IS NULL OR now() >= starts_at)
      AND (ends_at IS NULL OR now() <= ends_at);

    IF v_coupon_id IS NOT NULL THEN
        -- Check usage limit
        IF v_coupon_max_uses IS NULL OR v_coupon_used_count < v_coupon_max_uses THEN
            -- Check if coupon applies to this course (Global or Specific)
            IF NOT EXISTS (SELECT 1 FROM public.coupon_courses WHERE coupon_id = v_coupon_id) 
               OR EXISTS (SELECT 1 FROM public.coupon_courses WHERE coupon_id = v_coupon_id AND course_id = p_course_id) THEN
               
               -- Calculate coupon discount amount
               DECLARE 
                  coupon_disc_amt INT := 0;
                  current_price INT := GREATEST(base_price - discount_value, 0); -- Apply on top of existing discount? Or replace? 
                  -- Prompt says "Stack discount -> coupon", implying apply coupon ON TOP of course discount? 
                  -- Usually "Stack" means applied sequentially.
                  -- OR "Cap discount to course price".
               BEGIN
                  IF v_coupon_type = 'percentage' THEN
                      coupon_disc_amt := (current_price * v_coupon_value / 100);
                  ELSE
                      coupon_disc_amt := v_coupon_value;
                  END IF;

                  discount_value := discount_value + coupon_disc_amt;
               END;
            END IF;
        END IF;
    END IF;
  END IF;

  -- Ensure discount doesn't exceed price
  discount_value := LEAST(discount_value, base_price);

  RETURN QUERY SELECT
    base_price,
    discount_value,
    GREATEST(base_price - discount_value, 0);
END;
$$;
