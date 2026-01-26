// Motion animation presets and utilities
// Usage: import { fadeIn, slideUp, staggerContainer } from "@/lib/motion"

import { Variants } from "motion/react"

// Fade animations
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

// Scale animations
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" }
    }
}

export const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, type: "spring", stiffness: 200, damping: 20 }
    }
}

// Slide animations
export const slideUp: Variants = {
    hidden: { y: "100%" },
    visible: {
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
}

export const slideDown: Variants = {
    hidden: { y: "-100%" },
    visible: {
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
}

export const slideLeft: Variants = {
    hidden: { x: "100%" },
    visible: {
        x: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
}

export const slideRight: Variants = {
    hidden: { x: "-100%" },
    visible: {
        x: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
}

// Stagger container for children animations
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

export const staggerContainerFast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    }
}

// Stagger item (use with staggerContainer)
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
}

// Hover and tap animations (for use with whileHover/whileTap)
export const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.2 }
}

export const tapScale = {
    scale: 0.95
}

export const hoverLift = {
    y: -5,
    transition: { duration: 0.2 }
}

// Spring configurations
export const springConfig = {
    gentle: { type: "spring", stiffness: 120, damping: 14 },
    bouncy: { type: "spring", stiffness: 300, damping: 10 },
    stiff: { type: "spring", stiffness: 400, damping: 30 },
    slow: { type: "spring", stiffness: 50, damping: 20 }
} as const

// Page transition variants
export const pageTransition: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3, ease: "easeIn" }
    }
}

// Blur fade animation
export const blurFade: Variants = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: "easeOut" }
    }
}
