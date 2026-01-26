"use client";

import * as React from "react";
import { motion } from "motion/react";

const TERMINAL_LINES = [
    { type: "command", text: "$ npm run career-transformation" },
    { type: "success", text: "✓ Installing industry-standard skills..." },
    { type: "info", text: "→ React.js mastered" },
    { type: "info", text: "→ Node.js backend deployed" },
    { type: "info", text: "→ PostgreSQL database optimized" },
    { type: "success", text: "✓ Portfolio projects completed (12/12)" },
    { type: "success", text: "✓ Resume optimized for ATS" },
    { type: "success", text: "✓ Interview preparation: 50+ mock sessions" },
    { type: "output", text: "🎉 You're hired! Offer letter from TechCorp received." },
] as const;

function TerminalTyping() {
    const [visibleLines, setVisibleLines] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setVisibleLines((prev) => {
                if (prev >= TERMINAL_LINES.length) {
                    clearInterval(timer);
                    return prev;
                }
                return prev + 1;
            });
        }, 500);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-2">
            {TERMINAL_LINES.slice(0, visibleLines).map((line, index) => (
                <div
                    key={index}
                    className={`${line.type === "command"
                            ? "text-green-400"
                            : line.type === "success"
                                ? "text-emerald-400"
                                : line.type === "info"
                                    ? "text-gray-400"
                                    : "text-yellow-400"
                        }`}
                >
                    {line.text}
                </div>
            ))}
            {visibleLines < TERMINAL_LINES.length && (
                <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
            )}
        </div>
    );
}

export function TerminalSection() {
    return (
        <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
            </div>

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
        </section>
    );
}
