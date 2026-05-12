"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const { success } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const locales = [
    { value: "en", label: "EN" },
    { value: "bn", label: "BN" },
  ];

  const activeIndex = locales.findIndex((l) => l.value === locale);

  function onSelectChange(nextLocale: string) {
    if (nextLocale === locale) return;

    // Set the NEXT_LOCALE cookie
    document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=31536000;SameSite=Lax`;

    // Show a compact success toast immediately
    success(t("languageChanged") || "Language updated!");

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className={cn(
      "relative flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50",
      isPending && "opacity-60 pointer-events-none"
    )}>
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
