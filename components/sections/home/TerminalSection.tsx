"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Terminal, Zap, GitBranch, Clock, Cpu, CheckCircle2, Loader2, Folder } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface TerminalLine {
    type: "command" | "success" | "info" | "warning" | "output" | "error";
    text: string;
    id: string;
}

const TERMINAL_SEQUENCE = [
    {
        cmd: "npx create-next-app@latest skill-sync", output: [
            { type: "info", text: "◐ Creating a new app in ~/projects/skill-sync..." },
            { type: "warning", text: "◐ Installing dependencies: react, react-dom, next..." },
            { type: "success", text: "✓ Success! Created skill-sync" }
        ]
    },
    {
        cmd: "cd skill-sync && bun run dev", output: [
            { type: "info", text: "◐ Starting development server..." },
            { type: "success", text: "✓ Ready in 847ms" },
            { type: "output", text: "➜ Local:   http://localhost:3000" },
            { type: "output", text: "➜ Network: http://192.168.1.5:3000" }
        ]
    },
    {
        cmd: "git add . && git commit -m 'feat: initial commit'", output: [
            { type: "info", text: "[main (root-commit) a1b2c3d] feat: initial commit" },
            { type: "info", text: " 23 files changed, 1847 insertions(+)" },
            { type: "success", text: "✓ Changes committed successfully" }
        ]
    },
    {
        cmd: "bun run deploy --production", output: [
            { type: "warning", text: "◐ Building optimized production bundle..." },
            { type: "info", text: "◐ Compiling TypeScript..." },
            { type: "info", text: "◐ Optimizing assets..." },
            { type: "success", text: "✓ Build completed in 12.4s" },
            { type: "success", text: "✓ Deployed to https://skillsync.app" },
            { type: "output", text: "🚀 Your journey has officially begun!" }
        ]
    }
];

// Modern Blinking Block Cursor
const TerminalCursor = () => (
    <motion.span
        className="inline-block w-[10px] h-[18px] bg-[#FCB900] ml-0.5 rounded-[2px]"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
    />
);

// Oh My Posh Prompt - Pill-shaped segments with gaps
const OmpPrompt = ({ showTime = true }: { showTime?: boolean }) => {
    const [time, setTime] = React.useState("");

    React.useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center text-[13px] font-medium leading-none mr-3 select-none shrink-0 gap-1">
            {/* Segment 1: User - Gold */}
            <div className="bg-[#FCB900] text-[#1a1a1a] px-3 py-[5px] rounded-full flex items-center font-semibold">
                <span>dev</span>
            </div>

            {/* Segment 2: Directory - Cyan */}
            <div className="bg-[#22D3EE] text-[#0a2540] px-3 py-[5px] rounded-full flex items-center gap-1.5 font-semibold">
                <Folder className="w-3.5 h-3.5" />
                <span>skill-sync</span>
            </div>

            {/* Segment 3: Git Branch - Purple */}
            <div className="bg-[#A78BFA] text-white px-3 py-[5px] rounded-full flex items-center gap-1.5 font-semibold">
                <GitBranch className="w-3.5 h-3.5" />
                <span>main</span>
            </div>

            {/* Segment 4: Status Check - Green */}
            <div className="bg-[#34D399] text-[#064e3b] px-2 py-[5px] rounded-full flex items-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" />
                </svg>
            </div>

            {/* Time display (optional) */}
            {showTime && time && (
                <span className="ml-2 text-muted-foreground text-xs">{time}</span>
            )}
        </div>
    );
};

// Compact prompt for history - Same pill style but smaller
const OmpPromptCompact = () => (
    <div className="flex items-center text-xs font-medium leading-none mr-2 select-none shrink-0 gap-1">
        {/* User - Gold */}
        <div className="bg-[#FCB900] text-[#1a1a1a] px-2 py-[3px] rounded-full flex items-center font-semibold">
            <span>dev</span>
        </div>

        {/* Directory - Cyan */}
        <div className="bg-[#22D3EE] text-[#0a2540] px-2 py-[3px] rounded-full flex items-center gap-1 font-semibold">
            <Folder className="w-2.5 h-2.5" />
            <span>skill-sync</span>
        </div>

        {/* Git Branch - Purple */}
        <div className="bg-[#A78BFA] text-white px-2 py-[3px] rounded-full flex items-center gap-1 font-semibold">
            <GitBranch className="w-2.5 h-2.5" />
            <span>main</span>
        </div>

        {/* Check - Green */}
        <div className="bg-[#34D399] text-[#064e3b] px-1.5 py-[3px] rounded-full flex items-center">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l5 5L20 7" />
            </svg>
        </div>
    </div>
);

export function TerminalSection() {
    const [history, setHistory] = React.useState<TerminalLine[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = React.useState(0);
    const [currentText, setCurrentText] = React.useState("");
    const [isTyping, setIsTyping] = React.useState(true);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll
    React.useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [currentText, history]);

    // Sequence Logic
    React.useEffect(() => {
        let timeout: NodeJS.Timeout;

        const processSequence = async () => {
            if (currentLineIndex >= TERMINAL_SEQUENCE.length) {
                timeout = setTimeout(() => {
                    setHistory([]);
                    setCurrentLineIndex(0);
                    setCurrentText("");
                    setIsTyping(true);
                }, 5000);
                return;
            }

            const step = TERMINAL_SEQUENCE[currentLineIndex];

            if (currentText.length < step.cmd.length) {
                timeout = setTimeout(() => {
                    setCurrentText(step.cmd.slice(0, currentText.length + 1));
                }, 45 + Math.random() * 25);
            } else {
                if (isTyping) {
                    timeout = setTimeout(() => {
                        setIsTyping(false);
                        setHistory(prev => [...prev, {
                            type: "command",
                            text: step.cmd,
                            id: `cmd-${currentLineIndex}`
                        }]);
                    }, 250);
                } else {
                    const addOutput = async () => {
                        for (let i = 0; i < step.output.length; i++) {
                            await new Promise(r => setTimeout(r, 350));
                            setHistory(prev => [...prev, { ...step.output[i], id: `out-${currentLineIndex}-${i}`, type: step.output[i].type as TerminalLine["type"] }]);
                        }
                        await new Promise(r => setTimeout(r, 800));
                        setCurrentLineIndex(prev => prev + 1);
                        setCurrentText("");
                        setIsTyping(true);
                    };
                    addOutput();
                }
            }
        };

        processSequence();
        return () => clearTimeout(timeout);
    }, [currentLineIndex, currentText, isTyping]);


    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#FCB900]/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#22D3EE]/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#A78BFA]/8 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <Badge icon={Zap} iconClassName="text-primary" className="mb-6">
                        Real Developer Experience
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Build{" "}
                        <span className="bg-linear-to-r from-[#FCB900] via-[#22D3EE] to-[#A78BFA] bg-clip-text text-transparent">
                            Production-Ready
                        </span>{" "}
                        Software
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Experience the authentic workflow of professional software engineers.
                        From <code className="px-2 py-0.5 rounded bg-muted text-[#22D3EE] font-mono text-sm">init</code> to{" "}
                        <code className="px-2 py-0.5 rounded bg-muted text-[#34D399] font-mono text-sm">deploy</code>.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative group"
                >
                    {/* Glow effect behind terminal - Brand gradient */}
                    <div className="absolute -inset-1 bg-linear-to-r from-[#FCB900]/40 via-[#22D3EE]/30 to-[#A78BFA]/40 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                    <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 bg-[#0F172A]">
                        {/* Premium macOS-style Header */}
                        <div className="bg-linear-to-b from-[#0F172A] to-[#1E293B] px-4 py-3 flex items-center justify-between border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#EF4444] hover:bg-[#EF4444]/80 transition-colors cursor-pointer shadow-lg shadow-[#EF4444]/40" />
                                <div className="w-3 h-3 rounded-full bg-[#FCB900] hover:bg-[#FCB900]/80 transition-colors cursor-pointer shadow-lg shadow-[#FCB900]/40" />
                                <div className="w-3 h-3 rounded-full bg-[#34D399] hover:bg-[#34D399]/80 transition-colors cursor-pointer shadow-lg shadow-[#34D399]/40" />
                            </div>

                            {/* Center title with icon */}
                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                                <div className="p-1 rounded bg-linear-to-br from-[#FCB900]/20 to-[#22D3EE]/20">
                                    <Terminal className="w-3.5 h-3.5 text-[#FCB900]" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">skill-sync</span>
                            </div>

                            {/* Right side status */}
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <div className="flex items-center gap-1.5 text-xs">
                                    <Cpu className="w-3 h-3 text-[#34D399]" />
                                    <span>2.4%</span>
                                </div>
                                <div className="w-px h-3 bg-white/10" />
                                <div className="flex items-center gap-1.5 text-xs">
                                    <CheckCircle2 className="w-3 h-3 text-[#34D399]" />
                                </div>
                            </div>
                        </div>

                        {/* Terminal Content */}
                        <div
                            ref={containerRef}
                            className="p-5 h-[480px] overflow-hidden font-mono text-sm leading-relaxed bg-[#030712] selection:bg-[#FCB900]/30 selection:text-white"
                            style={{
                                backgroundImage: `
                                    radial-gradient(ellipse at top, rgba(252, 185, 0, 0.04) 0%, transparent 50%),
                                    radial-gradient(ellipse at bottom, rgba(34, 211, 238, 0.03) 0%, transparent 50%)
                                `
                            }}
                        >
                            {/* Welcome message */}
                            {history.length === 0 && !currentText && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mb-4 text-muted-foreground text-xs border-b border-white/10 pb-3"
                                >
                                    <span className="text-[#22D3EE]">●</span> Welcome to SkillSync Terminal{" "}
                                    <span className="text-muted-foreground">|</span>{" "}
                                    <span className="text-[#34D399]">v2.0.0</span>{" "}
                                    <span className="text-muted-foreground">|</span>{" "}
                                    <span className="text-[#FCB900]">Oh My Posh</span>
                                </motion.div>
                            )}

                            {history.map((line) => (
                                <motion.div
                                    key={line.id}
                                    initial={{ opacity: 0, x: -8, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    transition={{ duration: 0.3 }}
                                    className="mb-1.5"
                                >
                                    {line.type === "command" && (
                                        <div className="flex items-center flex-wrap gap-1 mb-3 mt-4 first:mt-0">
                                            <OmpPromptCompact />
                                            <span className="text-white font-semibold tracking-wide">{line.text}</span>
                                        </div>
                                    )}

                                    {line.type === "success" && (
                                        <div className="flex items-center gap-2 text-[#34D399] font-medium pl-2 py-0.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                            <span>{line.text}</span>
                                        </div>
                                    )}

                                    {line.type === "info" && (
                                        <div className="text-muted-foreground pl-2 py-0.5 flex items-center gap-2">
                                            <span className="text-[#22D3EE]">│</span>
                                            <span>{line.text}</span>
                                        </div>
                                    )}

                                    {line.type === "warning" && (
                                        <div className="flex items-center gap-2 text-[#FCB900] pl-2 py-0.5">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                                            <span>{line.text}</span>
                                        </div>
                                    )}

                                    {line.type === "output" && (
                                        <div className="text-[#22D3EE] pl-2 py-0.5 font-medium flex items-center gap-2">
                                            <span className="text-[#A78BFA]">→</span>
                                            <span>{line.text}</span>
                                        </div>
                                    )}

                                    {line.type === "error" && (
                                        <div className="text-[#EF4444] pl-2 py-0.5 flex items-center gap-2">
                                            <span>✗</span>
                                            <span>{line.text}</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Typing Line */}
                            <div className="flex items-center flex-wrap gap-1 mt-4 min-h-[32px]">
                                {isTyping && (
                                    <>
                                        <OmpPrompt />
                                        <span className="text-white font-semibold">{currentText}</span>
                                        <TerminalCursor />
                                    </>
                                )}
                                {!isTyping && currentLineIndex < TERMINAL_SEQUENCE.length && (
                                    <>
                                        <OmpPrompt />
                                        <TerminalCursor />
                                    </>
                                )}
                                {currentLineIndex >= TERMINAL_SEQUENCE.length && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2 text-[#34D399]"
                                    >
                                        <OmpPrompt showTime={true} />
                                        <span className="text-muted-foreground">Session complete. Restarting...</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Bottom status bar */}
                        <div className="bg-linear-to-r from-[#0F172A] to-[#1E293B] px-4 py-1.5 flex items-center justify-between border-t border-white/10 text-[10px] text-muted-foreground">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse shadow-sm shadow-[#34D399]/50" />
                                    NORMAL
                                </span>
                                <span>UTF-8</span>
                                <span>LF</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span>zsh 5.9</span>
                                <span>node v20.11.0</span>
                                <span className="text-[#22D3EE]">bun 1.0.25</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
