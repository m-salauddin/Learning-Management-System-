"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
    ArrowLeft,
    Star,
    Clock,
    Users,
    BookOpen,
    Play,
    CheckCircle2,
    Award,
    Globe,
    Calendar,
    FileText,
    Download,
    MessageCircle
} from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { Navbar } from "@/components/Navbar";

// Course data - in a real app, this would come from an API
const courseData: Record<string, {
    title: string;
    description: string;
    longDescription: string;
    image: string;
    price: string;
    duration: string;
    students: string;
    rating: number;
    reviews: number;
    instructor: {
        name: string;
        title: string;
        avatar: string;
        bio: string;
    };
    tags: string[];
    level: string;
    language: string;
    lastUpdated: string;
    whatYouLearn: string[];
    curriculum: {
        title: string;
        lessons: string[];
        duration: string;
    }[];
}> = {
    "full-stack-web-development": {
        title: "Full-Stack Web Development",
        description: "Master React, Node.js, and modern web technologies",
        longDescription: "This comprehensive course will take you from a complete beginner to a job-ready full-stack developer. You'll learn how to build modern, responsive websites and web applications using the latest technologies including React, Node.js, Express, MongoDB, and more. Through hands-on projects and real-world examples, you'll gain practical experience that employers are looking for.",
        image: "/courses/web-development.png",
        price: "৳15,000",
        duration: "6 months",
        students: "12,000+",
        rating: 4.9,
        reviews: 2847,
        instructor: {
            name: "Rifat Ahmed",
            title: "Senior Software Engineer at Google",
            avatar: "RA",
            bio: "10+ years of experience in web development. Previously worked at Meta and Microsoft. Passionate about teaching and helping others succeed in tech."
        },
        tags: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "TypeScript"],
        level: "Beginner to Advanced",
        language: "Bangla",
        lastUpdated: "January 2026",
        whatYouLearn: [
            "Build modern, responsive websites with HTML, CSS, and JavaScript",
            "Master React.js and build complex single-page applications",
            "Create REST APIs with Node.js and Express",
            "Work with MongoDB and design efficient database schemas",
            "Implement authentication and authorization",
            "Deploy applications to cloud platforms",
            "Write clean, maintainable code following best practices",
            "Collaborate using Git and GitHub"
        ],
        curriculum: [
            {
                title: "Module 1: Web Fundamentals",
                lessons: ["HTML5 Essentials", "CSS3 & Flexbox/Grid", "JavaScript Basics", "DOM Manipulation"],
                duration: "4 weeks"
            },
            {
                title: "Module 2: React.js Mastery",
                lessons: ["React Components & JSX", "State & Props", "Hooks Deep Dive", "React Router", "State Management"],
                duration: "6 weeks"
            },
            {
                title: "Module 3: Backend Development",
                lessons: ["Node.js Fundamentals", "Express.js Framework", "REST API Design", "Authentication & Security"],
                duration: "5 weeks"
            },
            {
                title: "Module 4: Database & Deployment",
                lessons: ["MongoDB & Mongoose", "Database Design", "Cloud Deployment", "CI/CD Pipelines"],
                duration: "4 weeks"
            },
            {
                title: "Module 5: Capstone Project",
                lessons: ["Project Planning", "Full-Stack Development", "Testing & Debugging", "Final Presentation"],
                duration: "5 weeks"
            }
        ]
    },
    "data-science-ml": {
        title: "Data Science & ML",
        description: "Learn Python, machine learning, and AI fundamentals",
        longDescription: "Dive deep into the world of data science and machine learning. This course covers everything from Python programming to advanced machine learning algorithms. You'll work with real datasets, build predictive models, and learn how to extract meaningful insights from data.",
        image: "/courses/data-science.png",
        price: "৳18,000",
        duration: "8 months",
        students: "8,500+",
        rating: 4.8,
        reviews: 1923,
        instructor: {
            name: "Dr. Fatima Khan",
            title: "AI Researcher at DeepMind",
            avatar: "FK",
            bio: "PhD in Machine Learning from MIT. Published researcher with expertise in deep learning and computer vision."
        },
        tags: ["Python", "TensorFlow", "Pandas", "Scikit-learn", "NumPy", "Deep Learning"],
        level: "Intermediate",
        language: "Bangla",
        lastUpdated: "December 2025",
        whatYouLearn: [
            "Master Python programming for data science",
            "Analyze and visualize data with Pandas and Matplotlib",
            "Build machine learning models with Scikit-learn",
            "Implement deep learning with TensorFlow and Keras",
            "Work with real-world datasets",
            "Deploy ML models to production",
            "Understand statistical concepts and probability",
            "Create compelling data visualizations"
        ],
        curriculum: [
            {
                title: "Module 1: Python for Data Science",
                lessons: ["Python Basics", "NumPy & Pandas", "Data Visualization", "Data Cleaning"],
                duration: "5 weeks"
            },
            {
                title: "Module 2: Statistics & Probability",
                lessons: ["Descriptive Statistics", "Probability Theory", "Hypothesis Testing", "Regression Analysis"],
                duration: "4 weeks"
            },
            {
                title: "Module 3: Machine Learning",
                lessons: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Feature Engineering"],
                duration: "8 weeks"
            },
            {
                title: "Module 4: Deep Learning",
                lessons: ["Neural Networks", "CNNs & RNNs", "Transfer Learning", "NLP Basics"],
                duration: "6 weeks"
            },
            {
                title: "Module 5: Capstone Project",
                lessons: ["Problem Definition", "Data Collection", "Model Building", "Deployment"],
                duration: "5 weeks"
            }
        ]
    }
};

// Default course for unmatched slugs
const defaultCourse = courseData["full-stack-web-development"];

export default function CourseDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const course = courseData[slug] || defaultCourse;

    return (
        <div className="min-h-screen bg-background">

            {/* Hero Section */}
            <div className="relative bg-muted/30 pt-28 pb-16 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back button */}
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Courses
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Course Info */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                        >
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.tags.slice(0, 4).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                                {course.title}
                            </h1>
                            <p className="text-lg text-muted-foreground mb-6">
                                {course.description}
                            </p>

                            {/* Meta info */}
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold">{course.rating}</span>
                                    <span className="text-muted-foreground">({course.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    {course.students} students
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    {course.duration}
                                </div>
                            </div>

                            {/* Instructor */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                    {course.instructor.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold">{course.instructor.name}</p>
                                    <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                                </div>
                            </div>

                            {/* Price and CTA */}
                            <div className="flex flex-wrap items-center gap-4">
                                <div>
                                    <span className="text-4xl font-black text-primary">{course.price}</span>
                                </div>
                                <button className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                                    Enroll Now
                                </button>
                                <button className="px-8 py-3 rounded-xl bg-muted font-semibold hover:bg-muted/80 transition-colors">
                                    Preview Course
                                </button>
                            </div>
                        </motion.div>

                        {/* Course Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative aspect-video rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                                {/* Play button overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <button className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-colors">
                                        <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About this course */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">About this course</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {course.longDescription}
                            </p>
                        </section>

                        {/* What you'll learn */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {course.whatYouLearn.map((item, index) => (
                                    <div key={index} className="flex gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                            <div className="space-y-4">
                                {course.curriculum.map((module, index) => (
                                    <div
                                        key={index}
                                        className="bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-2xl overflow-hidden"
                                    >
                                        <div className="p-4 flex items-center justify-between bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <h3 className="font-semibold">{module.title}</h3>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{module.duration}</span>
                                        </div>
                                        <div className="p-4 space-y-2">
                                            {module.lessons.map((lesson, lIndex) => (
                                                <div key={lIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <Play className="w-4 h-4" />
                                                    {lesson}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Instructor */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Your Instructor</h2>
                            <div className="bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                                        {course.instructor.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold">{course.instructor.name}</h3>
                                        <p className="text-primary font-medium mb-2">{course.instructor.title}</p>
                                        <p className="text-muted-foreground text-sm">{course.instructor.bio}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl p-6 space-y-6">
                            <h3 className="text-lg font-bold">This course includes:</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    <span>{course.curriculum.reduce((acc, m) => acc + m.lessons.length, 0)}+ lessons</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>{course.duration} of content</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Award className="w-5 h-5 text-primary" />
                                    <span>Certificate of completion</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Globe className="w-5 h-5 text-primary" />
                                    <span>{course.language}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <span>{course.level}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span>Last updated {course.lastUpdated}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Download className="w-5 h-5 text-primary" />
                                    <span>Downloadable resources</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MessageCircle className="w-5 h-5 text-primary" />
                                    <span>Community support</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50">
                                <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors mb-3">
                                    Enroll Now - {course.price}
                                </button>
                                <p className="text-xs text-center text-muted-foreground">
                                    30-day money-back guarantee
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
