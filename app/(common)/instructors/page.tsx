"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Github,
    Linkedin,
    Twitter,
    Globe,
    Code2,
    Database,
    Layout,
    Server,
    Terminal,
    Cpu,
    Mail,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// --- Types ---

type Instructor = {
    id: string;
    name: string;
    role: string;
    category: "Full Stack" | "Frontend" | "Backend" | "DevOps" | "Mobile" | "AI/ML";
    bio: string;
    image: string;
    skills: string[];
    social: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
    stats: {
        courses: number;
        students: number;
        rating: number;
    };
};

// --- Demo Data ---

const categories = ["All", "Full Stack", "Frontend", "Backend", "DevOps", "Mobile", "AI/ML"];

const instructors: Instructor[] = [
    {
        id: "1",
        name: "Alex Johnson",
        role: "Senior Full Stack Engineer",
        category: "Full Stack",
        bio: "Ex-Google engineer with 10+ years of experience in building scalable web applications using React, Node.js, and Cloud Infrastructure.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000&auto=format&fit=crop",
        skills: ["React", "Next.js", "Node.js", "AWS"],
        social: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
        },
        stats: { courses: 12, students: 4500, rating: 4.9 },
    },
    {
        id: "2",
        name: "Sarah Chen",
        role: "Lead Frontend Architect",
        category: "Frontend",
        bio: "Passionate about UI/UX and accessible design. Specializes in creating smooth, high-performance web animations and design systems.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000&auto=format&fit=crop",
        skills: ["Vue.js", "Tailwind CSS", "Framer Motion", "Three.js"],
        social: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            website: "https://example.com",
        },
        stats: { courses: 8, students: 3200, rating: 4.8 },
    },
    {
        id: "3",
        name: "Michael Ross",
        role: "Backend Systems Engineer",
        category: "Backend",
        bio: "Deep expertise in distributed systems, microservices, and database optimization. Love teaching complex concepts in simple ways.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000&auto=format&fit=crop",
        skills: ["Go", "PostgreSQL", "Redis", "Docker"],
        social: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
        },
        stats: { courses: 15, students: 8900, rating: 4.9 },
    },
    {
        id: "4",
        name: "Emily Davis",
        role: "DevOps Specialist",
        category: "DevOps",
        bio: "Helping developers ship code faster and safer. Expert in CI/CD pipelines, Kubernetes, and reliable infrastructure coding.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000&auto=format&fit=crop",
        skills: ["Kubernetes", "Terraform", "Jenkins", "Linux"],
        social: {
            github: "https://github.com",
            twitter: "https://twitter.com",
        },
        stats: { courses: 5, students: 1200, rating: 4.7 },
    },
    {
        id: "5",
        name: "David Kim",
        role: "Mobile App Developer",
        category: "Mobile",
        bio: "Building beautiful cross-platform mobile apps with Flutter and React Native. Focusing on native performance and fluid gestures.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000&auto=format&fit=crop",
        skills: ["Flutter", "React Native", "Swift", "Dart"],
        social: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            website: "https://example.com",
        },
        stats: { courses: 7, students: 2800, rating: 4.8 },
    },
    {
        id: "6",
        name: "Jessica Lee",
        role: "AI Research Scientist",
        category: "AI/ML",
        bio: "Bridging the gap between theory and practice in Machine Learning. Teaching NLP, Computer Vision, and Generative AI models.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2000&auto=format&fit=crop",
        skills: ["Python", "PyTorch", "TensorFlow", "Transformers"],
        social: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
        },
        stats: { courses: 4, students: 1500, rating: 5.0 },
    },
];

// --- Animation Variants ---

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 180,
            damping: 20,
            mass: 0.8,
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        scale: 0.9,
        filter: "blur(10px)",
        transition: {
            duration: 0.2,
            ease: "easeIn"
        }
    }
};

// --- Page Component ---

export default function InstructorsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredInstructors =
        selectedCategory === "All"
            ? instructors
            : instructors.filter((instructor) => instructor.category.includes(selectedCategory));

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Gradient Elements - Consistent with theme */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <main className="container mx-auto px-4 pt-40 pb-24 relative z-10">

                {/* Header Section */}
                <div className="text-center max-w-4xl mx-auto mb-20 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        World Class Mentors
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tight leading-tight"
                    >
                        Meet the <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-blue-500 drop-shadow-sm">Masters</span> <br />
                        Behind the Code
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed"
                    >
                        Learn from industry veterans who have built scalable systems at top tech giants.
                        We don&apos;t just teach code; we engineer careers.
                    </motion.p>
                </div>

                {/* Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-4 mb-20"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                                "relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border overflow-hidden group",
                                selectedCategory === category
                                    ? "border-primary text-primary-foreground scale-105"
                                    : "bg-background/40 border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/50 hover:scale-105"
                            )}
                        >
                            {/* Background fill animation for active state */}
                            {selectedCategory === category && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute inset-0 bg-primary z-0"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{category}</span>
                        </button>
                    ))}
                </motion.div>

                {/* Instructors Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredInstructors.map((instructor) => (
                            <motion.div
                                key={instructor.id}
                                layout
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="group relative h-full"
                            >
                                {/* Card container with glass effect - Matching CourseCard */}
                                <div className="relative h-full flex flex-col bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border rounded-3xl overflow-hidden transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:-translate-y-2">

                                    {/* Shine effect overlay */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </div>

                                    {/* Image Section with Padding (Inset look) */}
                                    <div className="p-4 pb-0 relative z-10">
                                        <div className="relative h-64 rounded-2xl overflow-hidden w-full">
                                            <Image
                                                src={instructor.image}
                                                alt={instructor.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent opacity-60" />

                                            {/* Social Links on Hover (Over Image) - Moved behind badges */}
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10 rounded-2xl">
                                                {instructor.social.github && (
                                                    <a href={instructor.social.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-background/90 text-foreground hover:text-primary hover:scale-110 transition-all border border-border">
                                                        <Github className="w-5 h-5" />
                                                    </a>
                                                )}
                                                {instructor.social.linkedin && (
                                                    <a href={instructor.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-background/90 text-foreground hover:text-primary hover:scale-110 transition-all border border-border">
                                                        <Linkedin className="w-5 h-5" />
                                                    </a>
                                                )}
                                                {instructor.social.twitter && (
                                                    <a href={instructor.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-background/90 text-foreground hover:text-primary hover:scale-110 transition-all border border-border">
                                                        <Twitter className="w-5 h-5" />
                                                    </a>
                                                )}
                                                {instructor.social.website && (
                                                    <a href={instructor.social.website} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-background/90 text-foreground hover:text-primary hover:scale-110 transition-all border border-border">
                                                        <Globe className="w-5 h-5" />
                                                    </a>
                                                )}
                                            </div>

                                            {/* Floating Badges - Moved to Top (z-20) */}
                                            <div className="absolute top-3 right-3 z-20">
                                                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-amber-400 border border-border shadow-lg">
                                                    {instructor.category}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-border shadow-lg z-20">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-400">★</span>
                                                    <span className="font-bold text-white text-xs">{instructor.stats.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 pt-4 flex flex-col grow relative z-10">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold mb-1 transition-colors duration-300 group-hover:text-primary">{instructor.name}</h3>
                                            <p className="text-sm font-medium text-primary/80 mb-3">{instructor.role}</p>
                                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                                {instructor.bio}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {instructor.skills.slice(0, 4).map(skill => (
                                                <span key={skill} className="px-2.5 py-1 rounded-md bg-muted/80 text-muted-foreground text-[10px] font-medium hover:bg-primary/10 hover:text-primary transition-colors duration-300">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Courses</span>
                                                    <span className="text-base font-bold text-foreground">
                                                        {instructor.stats.courses}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Students</span>
                                                    <span className="text-base font-bold text-foreground">
                                                        {instructor.stats.students.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <Button size="sm" className="rounded-xl px-5 group/btn bg-primary text-primary-foreground hover:bg-primary/90">
                                                Profile
                                                <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredInstructors.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Code2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No instructors found</h3>
                        <p className="text-muted-foreground">Try adjusting your category filter to see more results.</p>
                        <Button
                            variant="link"
                            onClick={() => setSelectedCategory("All")}
                            className="mt-4"
                        >
                            Clear Filters
                        </Button>
                    </motion.div>
                )}

            </main>
        </div>
    );
}
