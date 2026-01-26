"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Star, ArrowRight, GraduationCap } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

interface Course {
    title: string;
    description: string;
    image: string;
    price: string;
    duration: string;
    students: string;
    rating: number;
    tags: string[];
}

const COURSES: Course[] = [
    {
        title: "Full-Stack Web Development",
        description: "Master React, Node.js, and modern web technologies",
        image: "/courses/web-development.png",
        price: "৳15,000",
        duration: "6 months",
        students: "12,000+",
        rating: 4.9,
        tags: ["React", "Node.js", "MongoDB"],
    },
    {
        title: "Data Science & ML",
        description: "Learn Python, machine learning, and AI fundamentals",
        image: "/courses/data-science.png",
        price: "৳18,000",
        duration: "8 months",
        students: "8,500+",
        rating: 4.8,
        tags: ["Python", "TensorFlow", "Pandas"],
    },
    {
        title: "Mobile App Development",
        description: "Build iOS and Android apps with React Native",
        image: "/courses/mobile-development.png",
        price: "৳12,000",
        duration: "4 months",
        students: "6,200+",
        rating: 4.9,
        tags: ["React Native", "Expo", "Firebase"],
    },
    {
        title: "Cyber Security & Hacking",
        description: "Protect systems and networks from digital attacks",
        image: "/courses/cyber-security.png",
        price: "৳20,000",
        duration: "6 months",
        students: "5,000+",
        rating: 4.9,
        tags: ["Network", "Security", "Linux"],
    },
    {
        title: "Cloud Computing (AWS)",
        description: "Become a certified cloud solutions architect",
        image: "/courses/cloud-computing.png",
        price: "৳16,500",
        duration: "5 months",
        students: "4,500+",
        rating: 4.8,
        tags: ["AWS", "Docker", "Kubernetes"],
    },
    {
        title: "UI/UX Design Masterclass",
        description: "Design beautiful and functional user interfaces",
        image: "/courses/ui-ux-design.png",
        price: "৳10,000",
        duration: "3 months",
        students: "7,000+",
        rating: 4.9,
        tags: ["Figma", "Design", "Prototyping"],
    },
];

function CourseCard({ course }: { course: Course }) {
    return (
        <motion.div
            variants={staggerItem}
            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
        >
            {/* Course Image */}
            <div className="relative h-56 bg-linear-to-br from-muted to-muted/50 overflow-hidden">
                <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium border border-border/50">
                    {course.duration}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{course.rating}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                        ({course.students} students)
                    </span>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                </h3>
                <p className="text-muted-foreground mb-4">{course.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 rounded-md bg-muted text-xs font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                        <span className="text-2xl font-bold text-primary">{course.price}</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                        Enroll Now
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export function CoursesSection() {
    return (
        <section id="courses" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                            <GraduationCap className="w-4 h-4" />
                            Popular Courses
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Start your learning journey
                        </h2>
                    </div>
                    <Link
                        href="/courses"
                        className="mt-4 md:mt-0 flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                    >
                        View all courses
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {COURSES.map((course, index) => (
                        <CourseCard key={index} course={course} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
