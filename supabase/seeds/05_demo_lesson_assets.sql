-- ============================================================================
-- DEMO SEED PART 5: LESSON ASSETS
-- ============================================================================
-- Creates markdown content and video paths for each lesson

DO $$
DECLARE
    v_lesson RECORD;
    v_course_slug TEXT := 'web-development-python-django-react';
BEGIN
    -- Generate lesson assets for all lessons in main course
    FOR v_lesson IN 
        SELECT l.id, l.title, l.description, l.position, m.title as module_title, m.position as module_pos
        FROM public.lessons l
        JOIN public.modules m ON l.module_id = m.id
        WHERE m.course_id = 'cccccccc-0001-0001-0001-000000000001'
        ORDER BY m.position, l.position
    LOOP
        INSERT INTO public.lesson_assets (
            lesson_id,
            video_path,
            markdown_content,
            resources
        ) VALUES (
            v_lesson.id,
            v_course_slug || '/' || v_lesson.id || '.mp4',
            E'# ' || v_lesson.title || E'\n\n' ||
            E'## Overview\n\n' ||
            v_lesson.description || E'\n\n' ||
            E'## Key Concepts\n\n' ||
            E'- Important point about this topic\n' ||
            E'- Another key learning\n' ||
            E'- Best practices to remember\n\n' ||
            E'## Code Example\n\n' ||
            E'```python\n' ||
            E'# Example code for ' || v_lesson.title || E'\n' ||
            E'print("Hello from lesson ' || v_lesson.position || E'")\n' ||
            E'```\n\n' ||
            E'## Summary\n\n' ||
            E'In this lesson, we covered the essential concepts of ' || lower(v_lesson.title) || E'.\n\n' ||
            E'---\n\n' ||
            E'*Next: Continue to the next lesson to build on these concepts.*',
            '[{"title": "Lesson Slides PDF", "url": "' || v_course_slug || '/resources/lesson-' || v_lesson.position || '.pdf", "type": "pdf"}]'::jsonb
        )
        ON CONFLICT (lesson_id) DO UPDATE SET
            video_path = EXCLUDED.video_path,
            markdown_content = EXCLUDED.markdown_content;
    END LOOP;
END $$;
