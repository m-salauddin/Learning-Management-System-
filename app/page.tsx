"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  staggerContainer,
  staggerItem,
} from "@/lib/motion";
import {
  Code2,
  Rocket,
  Users,
  Trophy,
  ArrowRight,
  Play,
  Star,
  Zap,
  BookOpen,
  Target,
  Check,
  Sparkles,
  GraduationCap,
  Briefcase,
  Globe,
  ChevronRight,
  Quote,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiSpring,
  SiPython,
  SiAmazonwebservices,
  SiDocker,
  SiPostgresql,
  SiMongodb,
  SiTailwindcss,
  SiGit,
} from "react-icons/si";

import { Logo } from "@/components/ui/Logo";

export default function Home() {

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Navigation - Floating Glass */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl animate-fade-in-down">
        <div className="backdrop-blur-2xl bg-background/60 border border-border/50 rounded-2xl px-6 py-3 shadow-lg shadow-black/5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Nav Links - Center */}
            <div className="hidden md:flex items-center gap-1">
              {["Courses", "Features", "Pricing", "Community"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-all duration-200 shadow-lg">
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-visible pt-32 pb-20">
        {/* Background Layers */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Mesh - optimized blur */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-br from-primary/15 via-accent/10 to-transparent rounded-full blur-2xl translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-secondary/15 via-primary/10 to-transparent rounded-full blur-2xl -translate-x-1/4 translate-y-1/4" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>New: Full-Stack Career Path 2026</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                Master Tech Skills.
                <br />
                <span className="relative">
                  <span className="relative z-10 bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Land Your Dream Job.
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 100 2 150 6C200 10 250 6 298 2" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--accent)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                Bangladesh's premier learning platform. Industry-aligned curriculum, hands-on projects, and direct pathways to top tech companies.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <button className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-linear-to-r from-primary to-primary/80 text-white font-semibold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5">
                  Explore Courses
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-muted/50 hover:bg-muted font-semibold text-lg border border-border transition-all duration-300">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-2 border-background flex items-center justify-center text-xs font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">50,000+</strong> learners joined
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Stats Cards */}
            <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {/* Top Badge */}
              <div className="flex justify-end mb-4">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-linear-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/20">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">Top Rated</p>
                    <p className="text-white/90 text-sm">BD Platform</p>
                  </div>
                </div>
              </div>

              {/* Main Stats Card */}
              <div className="p-8 rounded-3xl bg-card/80 border border-border shadow-2xl">
                {/* Top Row */}
                <div className="grid grid-cols-2 gap-0">
                  <div className="p-6 border-r border-b border-border/50">
                    <AnimatedStatCard
                      icon={GraduationCap}
                      end={200}
                      suffix="+"
                      label="Expert Courses"
                      color="text-primary"
                      bgColor="bg-primary/10"
                    />
                  </div>
                  <div className="p-6 border-b border-border/50">
                    <AnimatedStatCard
                      icon={Users}
                      end={50}
                      suffix="K+"
                      label="Active Learners"
                      color="text-secondary"
                      bgColor="bg-secondary/10"
                    />
                  </div>
                </div>
                {/* Bottom Row */}
                <div className="grid grid-cols-2 gap-0">
                  <div className="p-6 border-r border-border/50">
                    <AnimatedStatCard
                      icon={Briefcase}
                      end={95}
                      suffix="%"
                      label="Job Placement"
                      color="text-success"
                      bgColor="bg-success/10"
                    />
                  </div>
                  <div className="p-6">
                    <AnimatedStatCard
                      icon={Star}
                      end={4.9}
                      suffix=""
                      label="Average Rating"
                      color="text-warning"
                      bgColor="bg-warning/10"
                      decimals={1}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="flex justify-start mt-4">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold">Certificate Verified</p>
                    <p className="text-muted-foreground text-sm">Industry recognized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Tech Stack Marquee */}
      < section className="relative py-16 border-y border-border/50" >
        {/* Header */}
        < div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10" >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">
              Master the technologies that{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                companies are hiring for
              </span>
            </h3>
            <p className="text-muted-foreground">
              Industry-standard tools and frameworks used by top tech companies
            </p>
          </motion.div>
        </div >

        {/* Marquee Container */}
        < div className="relative" >
          {/* First Marquee Row */}
          < div className="marquee-container mb-4" >
            <TechMarquee direction="left" />
          </div >

          {/* Second Marquee Row */}
          < div className="marquee-container" >
            <TechMarquee direction="right" />
          </div >
        </div >
      </section >

      {/* Features - Bento Grid */}
      < section id="features" className="py-24 relative overflow-hidden" >
        {/* Background */}
        < div className="absolute inset-0 bg-muted/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
              Everything you need to
              <br />
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                succeed in tech
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From zero to hero with our comprehensive learning ecosystem
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Large Feature Card */}
            <motion.div
              variants={staggerItem}
              className="lg:col-span-2 lg:row-span-2 group relative p-8 rounded-3xl bg-linear-to-br from-primary/10 via-card to-card border border-border overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Expert-Led Courses</h3>
                <p className="text-muted-foreground text-lg mb-6 max-w-md">
                  Learn from industry professionals with real-world experience at Google, Meta, Amazon, and local tech giants.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {["Video Lessons", "Live Sessions", "Projects", "Mentorship"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Regular Feature Cards */}
            {[
              {
                icon: Code2,
                title: "Hands-On Projects",
                description: "Build real applications for your portfolio",
                color: "secondary",
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Join 50,000+ active learners",
                color: "accent",
              },
              {
                icon: Trophy,
                title: "Job Placement",
                description: "95% placement rate within 6 months",
                color: "success",
              },
              {
                icon: Target,
                title: "Skill Tracking",
                description: "GitHub-style learning streaks",
                color: "warning",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-${feature.color}`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section >

      {/* Courses Section */}
      < section id="courses" className="py-24" >
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
            <Link href="/courses" className="mt-4 md:mt-0 flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
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
            {[
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
            ].map((course, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Course Image/Icon */}
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
            ))}
          </motion.div>
        </div>
      </section >

      {/* Terminal Section */}
      < section className="py-24 bg-[#0a0a0a] relative overflow-hidden" >
        {/* Background Effects */}
        < div className="absolute inset-0" >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
        </div >

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Your Journey Starts Here
            </h2>
            <p className="text-gray-400 text-lg">
              See what you'll achieve in just a few months
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10"
          >
            {/* Terminal Header */}
            <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="ml-4 text-sm text-gray-500 font-mono">
                student@skillsync ~ career-transformation
              </span>
            </div>

            {/* Terminal Body */}
            <div className="bg-[#0d0d0d] p-6 font-mono text-sm">
              <TerminalTyping />
            </div>
          </motion.div>
        </div>
      </section >

      {/* Pricing Section */}
      < section id="pricing" className="py-24 relative overflow-hidden" >
        <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Simple Pricing
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
              Invest in your future
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose a plan that fits your learning goals
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for exploring",
                features: ["5 free courses", "Community access", "Basic projects", "Email support"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "৳999/mo",
                description: "Best for serious learners",
                features: ["All 200+ courses", "Live mentorship", "Premium projects", "Certificate", "Priority support", "Job preparation"],
                cta: "Start Pro Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For teams & companies",
                features: ["Unlimited seats", "Custom curriculum", "Dedicated manager", "API access", "Analytics dashboard"],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className={`relative p-8 rounded-3xl border ${plan.popular
                  ? "bg-linear-to-b from-primary/10 to-card border-primary/50 shadow-xl shadow-primary/10"
                  : "bg-card border-border"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold">{plan.price}</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className={`w-5 h-5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-medium transition-all ${plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted hover:bg-muted/80"
                    }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section >

      {/* Testimonials - Wall of Love */}
      < section id="community" className="relative py-32 overflow-hidden bg-muted/20" >
        {/* Ambient Lights */}
        < div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm mb-6">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">Trusted by 50,000+ Developers</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Don't just take our <br />
              <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                word for it.
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the community that's redefining the tech landscape in Bangladesh. Real stories from real developers.
            </p>
          </motion.div>

          {/* Testimonial Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {[
              {
                quote: "I was stuck in tutorials for years. SkillSyncBD gave me the roadmap and mentorship I needed to actually build things. I landed my first remote job in 3 months!",
                name: "Rafiq Ahmed",
                role: "Software Engineer @ Pathao",
                avatar: "RA",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                quote: "The depth of the cloud computing course is insane. I went from knowing nothing about AWS to deploying scalable microservices. Worth every penny.",
                name: "Fatima Khan",
                role: "DevOps Engineer @ Grameenphone",
                avatar: "FK",
                gradient: "from-violet-500 to-fuchsia-500"
              },
              {
                quote: "It's not just a course, it's a family. The community support is unmatched. Whenever I faced a bug, someone was there to help. Truly life-changing.",
                name: "Tanvir Hassan",
                role: "Frontend Dev @ bKash",
                avatar: "TH",
                gradient: "from-emerald-500 to-teal-500"
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -5 }}
                className={`relative p-8 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 group
                  ${index === 1 ? 'bg-background/60 md:-translate-y-8' : 'bg-background/40 hover:bg-background/60'}
                `}
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 rounded-3xl bg-linear-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Quote Icon */}
                  <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${testimonial.gradient} bg-opacity-10 flex items-center justify-center mb-6`}>
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                    <div className={`w-12 h-12 rounded-full bg-linear-to-br ${testimonial.gradient} p-[2px]`}>
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-sm font-bold">
                        {testimonial.avatar}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                      <p className="text-xs text-primary font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section >

      {/* CTA Section - Quantum Prism */}
      < section className="relative py-32 overflow-hidden" >
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-[3rem] bg-background border border-border shadow-2xl"
          >
            {/* Animated Mesh Gradient Background - Contained */}
            <div className="absolute inset-0 opacity-100 dark:opacity-40 transition-opacity duration-500">
              <div className="absolute inset-0 bg-linear-to-br from-primary via-background to-secondary animate-gradient-xy" />
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
            </div>

            {/* Grid Overlay */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />

            {/* Content & Glass Layers */}
            <div className="relative z-10 px-8 py-24 md:py-32 text-center">

              {/* Central Glowing Orb (Behind Text) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/30 rounded-full blur-[100px] pointer-events-none opacity-50 animate-pulse" />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/40 border border-white/10 text-foreground font-medium text-sm mb-8 backdrop-blur-md shadow-sm"
              >
                <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="tracking-wide">Admissions Open for Winter 2026</span>
              </motion.div>

              <h2 className="relative text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground mb-8 leading-[0.9]">
                Build What <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary bg-size-[200%_auto] animate-text-shimmer">
                  Matters.
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                From your first line of code to your first day at a tech giant. We're with you every step of the journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center relative z-30">
                <button className="relative px-12 py-5 rounded-2xl bg-foreground text-background font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-primary/10">
                  <span className="flex items-center gap-2">
                    Get Started Now
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </button>

                <button className="px-12 py-5 rounded-2xl bg-background/50 border border-foreground/10 text-foreground font-semibold text-lg hover:bg-background/80 transition-all backdrop-blur-xl">
                  Explore Structure
                </button>
              </div>

              {/* Floating Glass Cards - CSS animation only */}
              <div className="absolute top-20 left-10 xl:left-24 hidden xl:block pointer-events-none animate-float">
                <div className="p-4 rounded-2xl bg-background/30 backdrop-blur-xl border border-white/20 shadow-xl w-48 -rotate-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Code2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="h-2 w-16 bg-foreground/10 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-foreground/10 rounded-full" />
                    <div className="h-2 w-2/3 bg-foreground/10 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-16 right-10 xl:right-24 hidden xl:block pointer-events-none animate-float" style={{ animationDelay: '1s' }}>
                <div className="p-4 rounded-2xl bg-background/30 backdrop-blur-xl border border-white/20 shadow-xl w-48 rotate-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="h-2 w-12 bg-foreground/10 rounded-full mb-1" />
                      <div className="h-2 w-8 bg-foreground/10 rounded-full" />
                    </div>
                  </div>
                  <div className="text-xs font-mono text-foreground/60 text-center bg-foreground/5 rounded py-1">
                    &gt; Offer Accepted
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section >

      {/* Footer */}
      < footer className="border-t border-border py-16 bg-muted/30" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <Logo />
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Bangladesh's premier tech learning platform. Building the next generation of developers.
              </p>
              <div className="flex items-center gap-3">
                {[Globe, SiGit].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Platform", links: ["Courses", "Pricing", "Enterprise", "Blog"] },
              { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
              { title: "Resources", links: ["Documentation", "Help Center", "Community", "Partners"] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 SkillSyncBD. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer >
    </div >
  );
}

// Animated Stat Card Component with Counter
function AnimatedStatCard({
  icon: Icon,
  end,
  suffix = "",
  label,
  color,
  bgColor,
  decimals = 0,
}: {
  icon: React.ElementType;
  end: number;
  suffix?: string;
  label: string;
  color: string;
  bgColor: string;
  decimals?: number;
}) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  React.useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeOutQuart;

      setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, decimals]);

  return (
    <div ref={ref} className="text-center">
      <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <p className="text-3xl font-bold tracking-tight">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-muted-foreground text-sm mt-1">{label}</p>
    </div>
  );
}

// Terminal Typing Animation Component
function TerminalTyping() {
  const [mounted, setMounted] = React.useState(false);
  const [displayedLines, setDisplayedLines] = React.useState<string[]>([]);

  const lines = [
    { text: "$ skillsync init my-career", delay: 0 },
    { text: "✓ Installing fundamentals...", delay: 800 },
    { text: "✓ Building real projects...", delay: 1600 },
    { text: "✓ Connecting with mentors...", delay: 2400 },
    { text: "✓ Preparing for interviews...", delay: 3200 },
    { text: "", delay: 4000 },
    { text: "🎉 Success! You're now job-ready!", delay: 4200 },
    { text: "→ 95% of graduates hired within 6 months", delay: 5000 },
  ];

  React.useEffect(() => {
    setMounted(true);
    lines.forEach(({ text, delay }) => {
      setTimeout(() => {
        setDisplayedLines((prev) => [...prev, text]);
      }, delay);
    });
  }, []);

  if (!mounted) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="w-2 h-5 bg-green-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-2 min-h-48">
      {displayedLines.map((line, index) => (
        <div
          key={index}
          className={`${line.startsWith("$")
            ? "text-green-400"
            : line.startsWith("✓")
              ? "text-blue-400"
              : line.startsWith("🎉")
                ? "text-yellow-400 font-bold text-base"
                : line.startsWith("→")
                  ? "text-purple-400"
                  : "text-gray-400"
            }`}
        >
          {line}
        </div>
      ))}
      <span className="inline-block w-2 h-5 bg-green-500 animate-pulse ml-1" />
    </div>
  );
}

// Tech Marquee Component - CSS-only for performance
function TechMarquee({ direction = "left" }: { direction?: "left" | "right" }) {
  const techStack = [
    { name: "React", icon: SiReact, color: "text-cyan-400" },
    { name: "Next.js", icon: SiNextdotjs, color: "text-foreground" },
    { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
    { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
    { name: "Spring Boot", icon: SiSpring, color: "text-green-400" },
    { name: "Python", icon: SiPython, color: "text-yellow-400" },
    { name: "AWS", icon: SiAmazonwebservices, color: "text-orange-400" },
    { name: "Docker", icon: SiDocker, color: "text-blue-400" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "text-sky-400" },
    { name: "MongoDB", icon: SiMongodb, color: "text-green-500" },
    { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-400" },
    { name: "Git", icon: SiGit, color: "text-orange-500" },
  ];

  return (
    <div className={`marquee-track ${direction === "right" ? "marquee-track-reverse" : ""}`}>
      {/* Duplicate items for seamless loop */}
      {[...techStack, ...techStack].map((tech, index) => (
        <div
          key={`${tech.name}-${index}`}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card/80 border border-border hover:border-primary/40 transition-colors duration-200 shrink-0"
        >
          <tech.icon className={`w-5 h-5 ${tech.color}`} />
          <span className="font-medium whitespace-nowrap">{tech.name}</span>
        </div>
      ))}
    </div>
  );
}

