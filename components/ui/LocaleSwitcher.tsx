"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const locales = [
    { value: "en", label: "EN" },
    { value: "bn", label: "BN" },
  ];

  const activeIndex = locales.findIndex((l) => l.value === locale);

  function onSelectChange(nextLocale: string) {
    if (nextLocale === locale) return;
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known locales are passed to `replace`
      { pathname, params },
      { locale: nextLocale }
    );
  }

  return (
    <div className="relative flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50">
      <motion.div
        className="absolute left-1 top-1 w-8 h-8 bg-primary rounded-full z-0 shadow-sm"
        initial={false}
        animate={{ x: activeIndex * 36 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
      />
      {locales.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onSelectChange(value)}
          className={cn(
            "relative z-10 flex cursor-pointer items-center justify-center w-8 h-8 rounded-full text-[10px] font-black",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "transition-all duration-300",
            locale === value
              ? "text-white dark:text-[#020615]"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
