'use client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    textClassName?: string;
}
const logoConfig = {
    sm: { height: 26, fullWidth: 100, smallWidth: 26 },
    md: { height: 32, fullWidth: 124, smallWidth: 32 },
    lg: { height: 44, fullWidth: 170, smallWidth: 44 },
    xl: { height: 56, fullWidth: 215, smallWidth: 56 }
};
export const Logo = ({ className = "", showText = true, size = "md", textClassName = "" }: LogoProps) => {
    const config = logoConfig[size];
    return (
        <div className={cn("relative flex items-center transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer", className)}>
            {showText ? (
                <>
                    <div className={cn("relative", textClassName || "block")}>
                        <Image
                            src="/logo/logo-full-light.png"
                            alt="DokkhotaIT Logo"
                            width={config.fullWidth}
                            height={config.height}
                            className="dark:hidden object-contain"
                            style={{ width: config.fullWidth, height: config.height }}
                            unoptimized
                            priority
                        />
                        <Image
                            src="/logo/logo-full-dark.png"
                            alt="DokkhotaIT Logo"
                            width={config.fullWidth}
                            height={config.height}
                            className="hidden dark:block object-contain"
                            style={{ width: config.fullWidth, height: config.height }}
                            unoptimized
                            priority
                        />
                        <div className="absolute inset-0 bg-primary/5 blur-xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {textClassName && textClassName.includes("hidden") && (
                        <div className="sm:hidden relative">
                            <Image
                                src="/logo/logo-small-light.png"
                                alt="DokkhotaIT Logo"
                                width={config.smallWidth}
                                height={config.height}
                                className="dark:hidden object-contain"
                                style={{ width: config.smallWidth, height: config.height }}
                                unoptimized
                                priority
                            />
                            <Image
                                src="/logo/logo-small-dark.png"
                                alt="DokkhotaIT Logo"
                                width={config.smallWidth}
                                height={config.height}
                                className="hidden dark:block object-contain"
                                style={{ width: config.smallWidth, height: config.height }}
                                unoptimized
                                priority
                            />
                            <div className="absolute inset-0 bg-primary/5 blur-lg -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    )}
                </>
            ) : (
                 <div className="relative">
                    <Image
                        src="/logo/logo-small-light.png"
                        alt="DokkhotaIT Logo"
                        width={config.smallWidth}
                        height={config.height}
                        className="dark:hidden object-contain"
                        style={{ width: config.smallWidth, height: config.height }}
                        unoptimized
                        priority
                    />
                    <Image
                        src="/logo/logo-small-dark.png"
                        alt="DokkhotaIT Logo"
                        width={config.smallWidth}
                        height={config.height}
                        className="hidden dark:block object-contain"
                        style={{ width: config.smallWidth, height: config.height }}
                        unoptimized
                        priority
                    />
                     <div className="absolute inset-0 bg-primary/5 blur-lg -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            )}
        </div>
    );
};
export const LogoIcon = ({ size = 32, className = "" }: { size?: number; className?: string }) => {
    return (
        <div className={cn("relative group cursor-pointer transition-transform duration-200 hover:scale-105", className)}>
             <Image
                src="/logo/logo-small-light.png"
                alt="DokkhotaIT"
                width={size}
                height={size}
                className="dark:hidden object-contain"
                style={{ width: size, height: size }}
                unoptimized
            />
            <Image
                src="/logo/logo-small-dark.png"
                alt="DokkhotaIT"
                width={size}
                height={size}
                className="hidden dark:block object-contain"
                style={{ width: size, height: size }}
                unoptimized
            />
            <div className="absolute inset-0 bg-primary/20 blur-lg -z-10 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        </div>
    );
};
