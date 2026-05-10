"use client";
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { HelpCircle, ChevronDown, Plus, Minus } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";

interface FAQItem {
    question: string;
    answer: string;
}

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
                suppressHydrationWarning
                className={`
                    relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                    ${isOpen
                        ? "bg-primary/5 dark:bg-primary/10 border-primary/30"
                        : "bg-card/50 dark:bg-card/30 hover:bg-card/80 dark:hover:bg-card/50 border-border/50 hover:border-primary/20"
                    }
                    border backdrop-blur-sm
                `}
            >
                <div suppressHydrationWarning className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                    ${isOpen ? "bg-linear-to-r from-primary/5 via-transparent to-primary/5" : ""}
                `} />
                <div suppressHydrationWarning className="relative flex items-start justify-between gap-4">
                    <div suppressHydrationWarning className={`
                        shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold
                        transition-all duration-300
                        ${isOpen
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        }
                    `}>
                        {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className={`
                            text-base sm:text-lg font-semibold transition-colors duration-300
                            ${isOpen ? "text-primary" : "text-foreground group-hover:text-primary"}
                        `}>
                            {item.question}
                        </h3>
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
    const t = useTranslations("FAQ");
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);
    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const questions = t.raw("questions") as { q: string; a: string }[];
    const FAQ_DATA: FAQItem[] = questions.map(q => ({
        question: q.q,
        answer: q.a
    }));

    const leftColumnFAQs = FAQ_DATA.filter((_, i) => i % 2 === 0);
    const rightColumnFAQs = FAQ_DATA.filter((_, i) => i % 2 === 1);

    return (
        <section id="faq" suppressHydrationWarning className="py-24 relative overflow-hidden">
            <div suppressHydrationWarning className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
            <div suppressHydrationWarning className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <Badge icon={HelpCircle} className="mb-4">
                        {t("badge")}
                    </Badge>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
                        {t("title")}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </motion.div>

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

                <div className="hidden lg:grid lg:grid-cols-2 gap-6">
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
            </div>
        </section>
    );
}
