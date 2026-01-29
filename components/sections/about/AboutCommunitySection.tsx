"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";


export function AboutCommunitySection() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = canvas.clientWidth;
        let height = canvas.height = canvas.clientHeight;

        const particles: Particle[] = [];
        const connectionDistance = 180;
        const particleCount = width < 768 ? 40 : 80; // Fewer particles on mobile

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 3 + 2;
                // Random mix of primary/secondary colors
                this.color = Math.random() > 0.5
                    ? `rgba(var(--primary-rgb), ${Math.random() * 0.5 + 0.2})`
                    : `rgba(var(--secondary-rgb), ${Math.random() * 0.5 + 0.2})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = "#A78BFA"; // Fallback purple
                // Hacking color support since accessing CSS vars in canvas is tricky without conversion
                // We'll use a fixed nice purple/blue for now or reading styles
                ctx.fillStyle = this.color.includes('primary') ? '#0036F9' : '#06B6D4';
                if (document.documentElement.classList.contains('dark')) {
                    ctx.fillStyle = this.color.includes('primary') ? '#FCB900' : '#22D3EE';
                }

                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            particles.forEach((p, i) => {
                p.update();
                p.draw();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = document.documentElement.classList.contains('dark')
                            ? `rgba(255, 255, 255, ${0.4 * (1 - distance / connectionDistance)})`
                            : `rgba(0, 0, 0, ${0.2 * (1 - distance / connectionDistance)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Handle resize
        const handleResize = () => {
            width = canvas.width = canvas.clientWidth;
            height = canvas.height = canvas.clientHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-background">
            {/* Canvas Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />

            {/* Gradient Overlay for Fade Effect */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background z-10" />
            <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-background z-10" />

            {/* Content Content */}
            <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md mb-8"
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold text-sm">Join the Hive Mind</span>
                </motion.div>

                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                    Not Just a Course. <br />
                    <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-xy">
                        A Living Network.
                    </span>
                </h2>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                    Connect with 50,000+ developers, mentors, and hiring managers in a collaborative ecosystem that accelerates your growth.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-2xl shadow-primary/20 h-14">
                        Join the Community
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-background hover:bg-muted/50 font-bold text-lg border border-border h-14 transition-all duration-300">
                        Explore Discord
                    </button>
                </div>
            </div>
        </section>
    );
}
