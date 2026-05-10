"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { PrimaryCTAButton, SecondaryCTAButton } from "@/components/ui/CTAButton";

export function AboutCommunitySection() {
    const t = useTranslations("About.Community");
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
        const particleCount = width < 768 ? 40 : 80;

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
                this.color = Math.random() > 0.5 
                    ? `rgba(var(--primary-rgb), ${Math.random() * 0.5 + 0.2})`
                    : `rgba(var(--secondary-rgb), ${Math.random() * 0.5 + 0.2})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                
                // Color logic
                ctx.fillStyle = this.color.includes('primary') ? '#FF4D00' : '#E31E6B';
                if (document.documentElement.classList.contains('dark')) {
                    ctx.fillStyle = this.color.includes('primary') ? '#FF4D00' : '#E31E6B';
                }
                
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, i) => {
                p.update();
                p.draw();

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

        const handleResize = () => {
            width = canvas.width = canvas.clientWidth;
            height = canvas.height = canvas.clientHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-background">
            {/* Background Canvas */}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full"
            />
            
            {/* Gradient Fades */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background z-10" />
            <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-background z-10" />

            {/* Content */}
            <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md mb-8"
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold text-sm">{t("badge")}</span>
                </motion.div>

                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                    {t("title1")} <br />
                    <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-xy">
                        {t("title2")}
                    </span>
                </h2>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                    {t("description")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <PrimaryCTAButton href="/register">
                        {t("ctaPrimary")}
                    </PrimaryCTAButton>
                    <SecondaryCTAButton href="/discord">
                        {t("ctaSecondary")}
                    </SecondaryCTAButton>
                </div>
            </div>
        </section>
    );
}
