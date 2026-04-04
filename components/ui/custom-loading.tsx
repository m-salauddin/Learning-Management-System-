"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}
const sizes = {
  sm: 24,
  md: 48,
  lg: 64,
  xl: 80,
};
export function CustomLoading({ className, size = "lg" }: LoadingProps) {
  const pixelSize = sizes[size];
  return (
    <div className={`flex flex-col items-center justify-center min-h-[40vh] w-full ${className}`}>
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-primary/15 blur-2xl rounded-full animate-pulse"
        />
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 transition-transform duration-700"
        >
          <Image
            src="/favicon.svg"
            alt="Loading..."
            width={pixelSize}
            height={pixelSize}
            className="drop-shadow-xl"
            priority
          />
        </motion.div>
        <div className="absolute inset-[-15%] animate-spin [animation-duration:8s]">
          <svg className="w-full h-full -rotate-90">
            <motion.circle
              cx="50%"
              cy="50%"
              r="46%"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-primary/10"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="46%"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="100, 100"
              className="text-primary"
              animate={{
                strokeDasharray: ["0, 100", "80, 100", "0, 100"],
                strokeDashoffset: [0, -100, -200],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <p className="text-sm font-medium tracking-wide text-foreground/60 uppercase">
          Loading
        </p>
        <div className="flex justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-1 h-1 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
export default function LoadingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="relative w-full min-h-screen bg-background">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md">
        <CustomLoading size="xl" />
      </div>
    </div>
  );
}
