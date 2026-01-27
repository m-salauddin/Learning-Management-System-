"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Star, ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const courses = [
    {
        slug: "full-stack-web-development",
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
        slug: "data-science-ml",
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
        slug: "mobile-app-development",
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
        slug: "cyber-security-hacking",
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
        slug: "cloud-computing-aws",
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
        slug: "ui-ux-design-masterclass",
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

export default function CoursesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                            Explore Our <span className="text-primary">Courses</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Discover the perfect course to upgrade your skills and advance your career.
                        </p>
                    </motion.div>
                </div>

                {/* Course Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {courses.map((course, index) => (
                        <motion.div
                            key={index}
                            variants={staggerItem}
                            className="group relative h-full"
                        >
                            {/* Card container with glass effect */}
                            <div className="relative h-full flex flex-col bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:-translate-y-2">
                                {/* Shine effect overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                {/* Course Image */}
                                <div className="p-4 pb-0">
                                    <div className="relative h-48 rounded-2xl overflow-hidden">
                                        <Image
                                            src={course.image}
                                            alt={course.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent" />

                                        {/* Duration badge */}
                                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/70 dark:bg-black/50 backdrop-blur-md text-sm font-semibold border border-white/20 shadow-lg">
                                            <span className="text-primary">
                                                {course.duration}
                                            </span>
                                        </div>

                                        {/* Rating badge */}
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-background/70 dark:bg-black/50 backdrop-blur-md border border-white/20 shadow-lg">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-bold text-foreground">{course.rating}</span>
                                            </div>
                                            <span className="text-muted-foreground text-xs">
                                                ({course.students})
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 pt-4 grow flex flex-col">
                                    <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">
                                        {course.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                        {course.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {course.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-muted/80 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50 dark:border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Price</span>
                                            <span className="text-2xl font-black text-primary">
                                                {course.price}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/courses/${course.slug}`}
                                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 group/btn"
                                        >
                                            <span>View Course</span>
                                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}
