"use client";
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, Plus, Minus } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";
interface FAQItem {
    question: string;
    answer: string;
}
const FAQ_DATA: FAQItem[] = [
    {
        question: "How do I get started with Dokkho IT?",
        answer: "Getting started is easy! Simply create a free account, browse our course catalog, and enroll in any course that interests you. Our platform guides you through every step of your learning journey with structured lessons, hands-on projects, and mentor support."
    },
    {
        question: "What courses are available on the platform?",
        answer: "We offer 200+ comprehensive courses covering Web Development (React, Next.js, Node.js), Mobile App Development (React Native, Flutter), AI & Machine Learning, Data Science, UI/UX Design, DevOps, and more. All courses are designed for the Bangladeshi job market."
    },
    {
        question: "Do you provide job placement support?",
        answer: "Yes! We have a 95% job placement rate. Our career support includes resume building, portfolio development, mock interviews, LinkedIn optimization, and direct connections with 100+ hiring partners in Bangladesh and abroad."
    },
    {
        question: "Are the courses self-paced or scheduled?",
        answer: "We offer both options! Most courses are self-paced with lifetime access, allowing you to learn at your convenience. We also have live batch programs with scheduled classes, real-time mentor interaction, and cohort-based learning."
    },
    {
        question: "What is included in the Pro subscription?",
        answer: "Pro members get unlimited access to all 200+ courses, live mentorship sessions, premium real-world projects, industry-recognized certificates, priority support, job preparation resources, and exclusive community access."
    },
    {
        question: "Can I get a refund if I'm not satisfied?",
        answer: "Absolutely! We offer a 7-day money-back guarantee for all paid courses and subscriptions. If you're not completely satisfied with your learning experience, contact our support team for a full refund."
    },
    {
        question: "Do you offer certificates upon completion?",
        answer: "Yes, all courses include completion certificates that are industry-recognized and shareable on LinkedIn. Pro members receive premium certificates with QR verification that employers can validate."
    },
    {
        question: "Is there a mobile app available?",
        answer: "Our platform is fully responsive and works seamlessly on all devices. We're also developing dedicated iOS and Android apps with offline learning capabilities, coming soon in 2026!"
    }
];
function FAQItem({ item, index, isOpen, onClick }: {
    item: FAQItem;
    index: number;
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <motion.div
            variants={staggerItem}
            className="group"
        >
            <div
                onClick={onClick}
                className={`
                    relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                    ${isOpen
                        ? "bg-primary/5 dark:bg-primary/10 border-primary/30"
                        : "bg-card/50 dark:bg-card/30 hover:bg-card/80 dark:hover:bg-card/50 border-border/50 hover:border-primary/20"
                    }
                    border backdrop-blur-sm
                `}
            >
                {}
                <div className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                    ${isOpen ? "bg-linear-to-r from-primary/5 via-transparent to-primary/5" : ""}
                `} />
                <div className="relative flex items-start justify-between gap-4">
                    {}
                    <div className={`
                        shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold
                        transition-all duration-300
                        ${isOpen
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        }
                    `}>
                        {String(index + 1).padStart(2, '0')}
                    </div>
                    {}
                    <div className="flex-1 min-w-0">
                        <h3 className={`
                            text-base sm:text-lg font-semibold transition-colors duration-300
                            ${isOpen ? "text-primary" : "text-foreground group-hover:text-primary"}
                        `}>
                            {item.question}
                        </h3>
                        {}
                        <AnimatePresence initial={false} mode="wait">
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{
                                        height: "auto",
                                        opacity: 1,
                                        transition: {
                                            height: {
                                                duration: 0.4,
                                                ease: [0.32, 0.72, 0, 1]
                                            },
                                            opacity: {
                                                duration: 0.25,
                                                delay: 0.1,
                                                ease: "easeOut"
                                            }
                                        }
                                    }}
                                    exit={{
                                        height: 0,
                                        opacity: 0,
                                        transition: {
                                            height: {
                                                duration: 0.3,
                                                ease: [0.32, 0.72, 0, 1]
                                            },
                                            opacity: {
                                                duration: 0.2,
                                                ease: "easeIn"
                                            }
                                        }
                                    }}
                                    className="overflow-hidden will-change-[height,opacity]"
                                    style={{ transformOrigin: "top" }}
                                >
                                    <p className="mt-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                                        {item.answer}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {}
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                        }}
                        className={`
                            shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                            transition-colors duration-300
                            ${isOpen
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                            }
                        `}
                    >
                        {isOpen ? (
                            <Minus className="w-5 h-5" />
                        ) : (
                            <Plus className="w-5 h-5" />
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
export function FAQSection() {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);
    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const leftColumnFAQs = FAQ_DATA.filter((_, i) => i % 2 === 0);
    const rightColumnFAQs = FAQ_DATA.filter((_, i) => i % 2 === 1);
    return (
        <section id="faq" className="py-24 relative overflow-hidden">
            {}
            <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />
            {}
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <Badge icon={HelpCircle} className="mb-4">
                        Got Questions?
                    </Badge>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
                        Frequently Asked{" "}
                        <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Find answers to common questions about our platform, courses, and learning experience
                    </p>
                </motion.div>
                {}
                {}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="lg:hidden space-y-4"
                >
                    {FAQ_DATA.map((item, index) => (
                        <FAQItem
                            key={index}
                            item={item}
                            index={index}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))}
                </motion.div>
                {}
                <div className="hidden lg:grid lg:grid-cols-2 gap-6">
                    {}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="space-y-4"
                    >
                        {leftColumnFAQs.map((item, i) => {
                            const actualIndex = i * 2;
                            return (
                                <FAQItem
                                    key={actualIndex}
                                    item={item}
                                    index={actualIndex}
                                    isOpen={openIndex === actualIndex}
                                    onClick={() => handleToggle(actualIndex)}
                                />
                            );
                        })}
                    </motion.div>
                    {}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="space-y-4"
                    >
                        {rightColumnFAQs.map((item, i) => {
                            const actualIndex = i * 2 + 1;
                            return (
                                <FAQItem
                                    key={actualIndex}
                                    item={item}
                                    index={actualIndex}
                                    isOpen={openIndex === actualIndex}
                                    onClick={() => handleToggle(actualIndex)}
                                />
                            );
                        })}
                    </motion.div>
                </div>
                {}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <p className="text-muted-foreground mb-4">
                        Still have questions?
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border hover:border-primary/30 hover:bg-card/80 transition-all duration-300 text-foreground font-medium group"
                    >
                        <span>Contact our support team</span>
                        <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
