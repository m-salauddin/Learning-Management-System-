"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { ToastProvider } from "@/components/ui/toast";
import { SocialLoginToast } from "@/components/auth/SocialLoginToast";
import { AuthListener } from "@/components/auth/AuthListener";
import { Suspense } from "react";
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

export function Providers({ 
  children, 
  locale, 
  messages,
  timeZone 
}: { 
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  timeZone: string;
}) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone={timeZone}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={true}
        disableTransitionOnChange
      >
        <ReduxProvider>
          <ToastProvider>
            <AuthListener />
            <Suspense fallback={<div />}>
              <SocialLoginToast />
            </Suspense>
            {children}
            <CookieConsent />
          </ToastProvider>
        </ReduxProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
