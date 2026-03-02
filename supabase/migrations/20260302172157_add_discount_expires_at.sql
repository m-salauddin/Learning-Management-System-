-- Add discount_expires_at to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS discount_expires_at TIMESTAMPTZ;

-- Recreate the create_course_at_top function to support discount_expires_at
CREATE OR REPLACE FUNCTION public.create_course_at_top(input_data jsonb)
RETURNS TABLE (id uuid, serial_number numeric) AS $$
DECLARE
  new_serial numeric;
  new_id uuid;
BEGIN
  -- Get the current minimum serial number and subtract 1000 to place at top
  SELECT coalesce(min(c.serial_number), 0) - 1000 INTO new_serial FROM courses c;
  
  -- Insert using jsonb_populate_record
  -- This is more resilient as it automatically handles all columns, including our new discount_expires_at
  INSERT INTO courses (
    title, slug, description, short_description, thumbnail_url, preview_video_url, 
    instructor_id, category_id, price, discount_price, discount_expires_at, level, course_type, 
    language, requirements, tags, batch_no, status, published, serial_number
  )
  SELECT 
    input_data->>'title',
    input_data->>'slug',
    input_data->>'description',
    input_data->>'short_description',
    input_data->>'thumbnail_url',
    input_data->>'preview_video_url',
    (input_data->>'instructor_id')::uuid,
    (input_data->>'category_id')::uuid,
    (input_data->>'price')::numeric,
    (input_data->>'discount_price')::numeric,
    (input_data->>'discount_expires_at')::timestamptz,
    (input_data->>'level')::course_level,
    (input_data->>'course_type')::course_type,
    input_data->>'language',
    ARRAY(SELECT jsonb_array_elements_text(input_data->'requirements')),
    ARRAY(SELECT jsonb_array_elements_text(input_data->'tags')),
    (input_data->>'batch_no')::integer,
    (input_data->>'status')::course_status,
    (input_data->>'published')::boolean,
    new_serial
  RETURNING courses.id INTO new_id;

  RETURN QUERY SELECT new_id, new_serial;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
