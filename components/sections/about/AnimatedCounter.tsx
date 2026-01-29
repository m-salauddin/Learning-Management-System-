"use client";

import * as React from "react";
import { useInView } from "motion/react";

interface AnimatedCounterProps {
    end: number;
    suffix?: string;
    decimals?: number;
}

export function AnimatedCounter({
    end,
    suffix = "",
    decimals = 0,
}: AnimatedCounterProps) {
    const [count, setCount] = React.useState(0);
    const ref = React.useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    React.useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
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
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}
