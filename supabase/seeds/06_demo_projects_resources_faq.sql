-- ============================================================================
-- DEMO SEED PART 6: PROJECTS, RESOURCES, FAQ
-- ============================================================================

-- PROJECTS (10 portfolio projects)
INSERT INTO public.course_projects (id, course_id, title, description, thumbnail_url, technologies, order_index, is_public)
VALUES
    ('ffffffff-0001-0001-0001-000000000001', 'cccccccc-0001-0001-0001-000000000001', 'Personal Portfolio Website', 'Build a stunning portfolio to showcase your work', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', ARRAY['HTML', 'CSS', 'JavaScript'], 1, true),
    ('ffffffff-0001-0001-0001-000000000002', 'cccccccc-0001-0001-0001-000000000001', 'Todo Application', 'Full-stack todo app with authentication', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400', ARRAY['Python', 'Django', 'SQLite'], 2, true),
    ('ffffffff-0001-0001-0001-000000000003', 'cccccccc-0001-0001-0001-000000000001', 'Blog Platform', 'Multi-user blog with comments and likes', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400', ARRAY['Django', 'PostgreSQL', 'Bootstrap'], 3, true),
    ('ffffffff-0001-0001-0001-000000000004', 'cccccccc-0001-0001-0001-000000000001', 'REST API for E-commerce', 'Complete API with products, orders, payments', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', ARRAY['Django REST', 'PostgreSQL', 'JWT'], 4, false),
    ('ffffffff-0001-0001-0001-000000000005', 'cccccccc-0001-0001-0001-000000000001', 'React Dashboard', 'Admin dashboard with charts and analytics', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', ARRAY['React', 'Chart.js', 'Tailwind'], 5, true),
    ('ffffffff-0001-0001-0001-000000000006', 'cccccccc-0001-0001-0001-000000000001', 'Social Media App', 'Twitter-like app with posts and followers', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', ARRAY['React', 'Django', 'PostgreSQL'], 6, false),
    ('ffffffff-0001-0001-0001-000000000007', 'cccccccc-0001-0001-0001-000000000001', 'Job Board Platform', 'Complete job listing and application system', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400', ARRAY['React', 'Django REST', 'Docker'], 7, false),
    ('ffffffff-0001-0001-0001-000000000008', 'cccccccc-0001-0001-0001-000000000001', 'Real-time Chat App', 'WebSocket-based chat application', 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400', ARRAY['React', 'Django Channels', 'Redis'], 8, false),
    ('ffffffff-0001-0001-0001-000000000009', 'cccccccc-0001-0001-0001-000000000001', 'E-commerce Store', 'Full-featured online store with payments', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400', ARRAY['React', 'Django', 'Stripe', 'AWS'], 9, false),
    ('ffffffff-0001-0001-0001-000000000010', 'cccccccc-0001-0001-0001-000000000001', 'DevOps Pipeline', 'CI/CD with Docker, GitHub Actions, AWS', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400', ARRAY['Docker', 'GitHub Actions', 'AWS', 'Terraform'], 10, false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_public = EXCLUDED.is_public;

-- RESOURCES (15 downloadable resources)
INSERT INTO public.course_resources (id, course_id, title, description, resource_type, storage_path, file_size_bytes, is_public, order_index)
VALUES
    ('gggggggg-0001-0001-0001-000000000001', 'cccccccc-0001-0001-0001-000000000001', 'Python Cheat Sheet', 'Quick reference for Python syntax', 'pdf', 'course-resources/main-course/python-cheatsheet.pdf', 524288, true, 1),
    ('gggggggg-0001-0001-0001-000000000002', 'cccccccc-0001-0001-0001-000000000001', 'Django Commands Reference', 'All Django CLI commands explained', 'pdf', 'course-resources/main-course/django-commands.pdf', 312567, true, 2),
    ('gggggggg-0001-0001-0001-000000000003', 'cccccccc-0001-0001-0001-000000000001', 'React Hooks Cheat Sheet', 'Quick reference for React hooks', 'pdf', 'course-resources/main-course/react-hooks.pdf', 287654, true, 3),
    ('gggggggg-0001-0001-0001-000000000004', 'cccccccc-0001-0001-0001-000000000001', 'Course Source Code', 'Complete source code for all projects', 'code', 'course-resources/main-course/source-code.zip', 15728640, false, 4),
    ('gggggggg-0001-0001-0001-000000000005', 'cccccccc-0001-0001-0001-000000000001', 'Database Design Templates', 'ERD templates for common applications', 'pdf', 'course-resources/main-course/db-templates.pdf', 1048576, false, 5),
    ('gggggggg-0001-0001-0001-000000000006', 'cccccccc-0001-0001-0001-000000000001', 'API Documentation Template', 'OpenAPI/Swagger template', 'file', 'course-resources/main-course/api-template.yaml', 45678, false, 6),
    ('gggggggg-0001-0001-0001-000000000007', 'cccccccc-0001-0001-0001-000000000001', 'Deployment Checklist', 'Pre-deployment checklist PDF', 'pdf', 'course-resources/main-course/deploy-checklist.pdf', 156789, false, 7),
    ('gggggggg-0001-0001-0001-000000000008', 'cccccccc-0001-0001-0001-000000000001', 'Docker Compose Templates', 'Ready-to-use Docker configurations', 'code', 'course-resources/main-course/docker-templates.zip', 234567, false, 8),
    ('gggggggg-0001-0001-0001-000000000009', 'cccccccc-0001-0001-0001-000000000001', 'VS Code Settings', 'Recommended VS Code configuration', 'file', 'course-resources/main-course/vscode-settings.json', 12345, true, 9),
    ('gggggggg-0001-0001-0001-000000000010', 'cccccccc-0001-0001-0001-000000000001', 'Git Workflow Guide', 'Best practices for Git branching', 'pdf', 'course-resources/main-course/git-workflow.pdf', 567890, true, 10),
    ('gggggggg-0001-0001-0001-000000000011', 'cccccccc-0001-0001-0001-000000000001', 'Python Official Docs', 'Link to official documentation', 'link', NULL, NULL, true, 11),
    ('gggggggg-0001-0001-0001-000000000012', 'cccccccc-0001-0001-0001-000000000001', 'Django Official Docs', 'Link to Django documentation', 'link', NULL, NULL, true, 12),
    ('gggggggg-0001-0001-0001-000000000013', 'cccccccc-0001-0001-0001-000000000001', 'React Official Docs', 'Link to React documentation', 'link', NULL, NULL, true, 13),
    ('gggggggg-0001-0001-0001-000000000014', 'cccccccc-0001-0001-0001-000000000001', 'Interview Prep Questions', '50+ common interview questions', 'pdf', 'course-resources/main-course/interview-prep.pdf', 789012, false, 14),
    ('gggggggg-0001-0001-0001-000000000015', 'cccccccc-0001-0001-0001-000000000001', 'Resume Template', 'Developer resume template', 'file', 'course-resources/main-course/resume-template.docx', 123456, false, 15)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, is_public = EXCLUDED.is_public;

-- Set external URLs for link resources
UPDATE public.course_resources SET external_url = 'https://docs.python.org/3/' WHERE id = 'gggggggg-0001-0001-0001-000000000011';
UPDATE public.course_resources SET external_url = 'https://docs.djangoproject.com/' WHERE id = 'gggggggg-0001-0001-0001-000000000012';
UPDATE public.course_resources SET external_url = 'https://react.dev/' WHERE id = 'gggggggg-0001-0001-0001-000000000013';

-- FAQ (15 questions)
INSERT INTO public.course_faq (id, course_id, question, answer, order_index, is_published)
VALUES
    ('hhhhhhhh-0001-0001-0001-000000000001', 'cccccccc-0001-0001-0001-000000000001', 'Do I need any prior programming experience?', 'No! This course is designed for complete beginners. We start from the very basics and gradually build up to advanced topics.', 1, true),
    ('hhhhhhhh-0001-0001-0001-000000000002', 'cccccccc-0001-0001-0001-000000000001', 'How long do I have access to the course?', 'You get lifetime access to all course materials, including any future updates we make to the content.', 2, true),
    ('hhhhhhhh-0001-0001-0001-000000000003', 'cccccccc-0001-0001-0001-000000000001', 'Will I get a certificate?', 'Yes! Upon completing all lessons and projects, you will receive a verified certificate that you can share on LinkedIn.', 3, true),
    ('hhhhhhhh-0001-0001-0001-000000000004', 'cccccccc-0001-0001-0001-000000000001', 'What if I get stuck on something?', 'You can ask questions in our Discord community where instructors and fellow students help each other. We respond within 24 hours.', 4, true),
    ('hhhhhhhh-0001-0001-0001-000000000005', 'cccccccc-0001-0001-0001-000000000001', 'Can I download the videos for offline viewing?', 'Currently, videos are streaming-only to protect the content. However, all code files, PDFs, and resources are downloadable.', 5, true),
    ('hhhhhhhh-0001-0001-0001-000000000006', 'cccccccc-0001-0001-0001-000000000001', 'What computer do I need?', 'Any computer running Windows 10+, macOS 10.14+, or Ubuntu 18.04+ with at least 4GB RAM and 10GB free disk space.', 6, true),
    ('hhhhhhhh-0001-0001-0001-000000000007', 'cccccccc-0001-0001-0001-000000000001', 'Is there a money-back guarantee?', 'Yes, we offer a 30-day money-back guarantee. If you are not satisfied, contact us for a full refund.', 7, true),
    ('hhhhhhhh-0001-0001-0001-000000000008', 'cccccccc-0001-0001-0001-000000000001', 'How is the course content delivered?', 'The course includes video lessons, written content, coding exercises, quizzes, and hands-on projects.', 8, true),
    ('hhhhhhhh-0001-0001-0001-000000000009', 'cccccccc-0001-0001-0001-000000000001', 'Can I get help with job placement?', 'While we do not guarantee jobs, we provide resume reviews, interview prep, and access to our job board.', 9, true),
    ('hhhhhhhh-0001-0001-0001-000000000010', 'cccccccc-0001-0001-0001-000000000001', 'Are the projects real-world applicable?', 'Absolutely! All projects are designed to mimic real-world scenarios and can be added to your portfolio.', 10, true),
    ('hhhhhhhh-0001-0001-0001-000000000011', 'cccccccc-0001-0001-0001-000000000001', 'How often is the course updated?', 'We update the course regularly to keep up with the latest changes in Python, Django, and React ecosystems.', 11, true),
    ('hhhhhhhh-0001-0001-0001-000000000012', 'cccccccc-0001-0001-0001-000000000001', 'Can I take this course on mobile?', 'Yes, our platform is mobile-responsive. However, for coding exercises, we recommend using a desktop/laptop.', 12, true),
    ('hhhhhhhh-0001-0001-0001-000000000013', 'cccccccc-0001-0001-0001-000000000001', 'Is this course in English or Bangla?', 'The course is primarily taught in Bangla with English technical terms. All code comments are in English.', 13, true),
    ('hhhhhhhh-0001-0001-0001-000000000014', 'cccccccc-0001-0001-0001-000000000001', 'Can I request additional topics?', 'Yes! We regularly add bonus content based on student requests. Join our Discord to suggest topics.', 14, true),
    ('hhhhhhhh-0001-0001-0001-000000000015', 'cccccccc-0001-0001-0001-000000000001', 'What payment methods do you accept?', 'We accept bKash, Nagad, Rocket, bank transfer, and international cards (Visa/Mastercard).', 15, true)
ON CONFLICT (id) DO UPDATE SET question = EXCLUDED.question, answer = EXCLUDED.answer;
