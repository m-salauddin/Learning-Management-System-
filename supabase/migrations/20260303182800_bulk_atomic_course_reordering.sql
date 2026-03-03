-- Create bulk atomical reordering RPC
CREATE OR REPLACE FUNCTION public.update_courses_order_bulk(
    updates jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    course_record jsonb;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    -- Defer the unique constraint to allow arbitrary swapping without temporary conflicts
    SET CONSTRAINTS courses_batch_type_serial_key DEFERRED;

    -- Loop over the updates and apply them
    -- updates is expected to be a JSON array like: [{"id": "uuid-1", "serial_number": 2}, ...]
    FOR course_record IN SELECT * FROM jsonb_array_elements(updates)
    LOOP
        UPDATE courses
        SET serial_number = (course_record->>'serial_number')::int
        WHERE id = (course_record->>'id')::uuid;
    END LOOP;
END;
$$;

-- Security: Prevent generic public access so only authenticated users/admins can execute
REVOKE EXECUTE ON FUNCTION public.update_courses_order_bulk FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_courses_order_bulk TO authenticated;
