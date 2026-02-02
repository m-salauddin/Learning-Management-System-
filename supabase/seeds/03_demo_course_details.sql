-- ============================================================================
-- DEMO SEED PART 3: COURSE DETAILS (Extended Marketing)
-- ============================================================================

INSERT INTO public.course_details (
    course_id,
    description_long,
    learning_outcomes,
    requirements,
    target_audience,
    curriculum_overview,
    language,
    seo_title,
    seo_description,
    seo_keywords
) VALUES (
    'cccccccc-0001-0001-0001-000000000001',
    E'# Welcome to the Complete Web Development Bootcamp!\n\n## What You''ll Learn\n\nThis comprehensive course is designed to take you from absolute beginner to professional full-stack developer. Over **45+ hours** of content, you''ll master:\n\n### Python Programming\n- Variables, data types, and operators\n- Control flow and loops\n- Functions and modules\n- Object-oriented programming\n- File handling and error management\n\n### Django Framework\n- MVC architecture and Django''s MTV pattern\n- Models, views, and templates\n- Django REST Framework for APIs\n- Authentication and permissions\n- Database relationships and queries\n\n### React.js Frontend\n- Components and JSX\n- State management with hooks\n- React Router for navigation\n- API integration with Axios\n- Modern UI with Tailwind CSS\n\n### Database & Deployment\n- PostgreSQL fundamentals\n- Database design and optimization\n- Docker containerization\n- Cloud deployment (AWS/Heroku)\n\n## Why This Course?\n\n✅ **Project-Based Learning** - Build 8 real projects\n✅ **Industry Best Practices** - Clean code, testing, CI/CD\n✅ **Lifetime Access** - Learn at your own pace\n✅ **Community Support** - Active Discord community\n✅ **Certificate** - Upon completion\n\n---\n\n*Start your developer journey today!*',
    
    ARRAY[
        'Build complete full-stack web applications from scratch',
        'Write clean, maintainable Python code following best practices',
        'Create RESTful APIs with Django REST Framework',
        'Build interactive user interfaces with React.js',
        'Design and optimize PostgreSQL databases',
        'Implement secure user authentication and authorization',
        'Deploy applications to production environments',
        'Use Git and GitHub for version control',
        'Debug and troubleshoot common development issues',
        'Work with Docker for containerization',
        'Write unit tests and integration tests',
        'Understand software architecture patterns'
    ],
    
    ARRAY[
        'A computer (Windows, Mac, or Linux) with internet access',
        'No prior programming experience required - we start from zero!',
        'Basic computer literacy (file management, web browsing)',
        'Dedication to practice - at least 10 hours per week recommended',
        'A code editor (we''ll help you install VS Code for free)'
    ],
    
    ARRAY[
        'Complete beginners who want to learn web development',
        'Students looking for a career change into tech',
        'Self-taught developers who want to fill knowledge gaps',
        'Entrepreneurs who want to build their own web applications',
        'Backend developers who want to learn React frontend',
        'Frontend developers who want to learn Python backend'
    ],
    
    E'This course is organized into 8 comprehensive modules:\n\n**Module 1-2:** Python fundamentals and advanced concepts\n**Module 3-4:** Django backend development\n**Module 5-6:** React frontend development\n**Module 7:** Database design and PostgreSQL\n**Module 8:** Deployment and production readiness\n\nEach module includes video lessons, hands-on exercises, quizzes, and projects.',
    
    'Bangla',
    'Web Development Course with Python, Django & React | Full-Stack Bootcamp',
    'Master full-stack web development with Python, Django, and React. Build 8 real projects, get certified. Best web development course in Bangladesh.',
    ARRAY['web development course', 'python course', 'django tutorial', 'react course', 'full stack bootcamp', 'programming course bangladesh', 'ওয়েব ডেভেলপমেন্ট কোর্স']
)
ON CONFLICT (course_id) DO UPDATE SET
    description_long = EXCLUDED.description_long,
    learning_outcomes = EXCLUDED.learning_outcomes,
    requirements = EXCLUDED.requirements,
    target_audience = EXCLUDED.target_audience;
