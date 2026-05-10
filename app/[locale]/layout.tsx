import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Hind_Siliguri } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { ToastProvider } from "@/components/ui/toast";
import { SocialLoginToast } from "@/components/auth/SocialLoginToast";
import { AuthListener } from "@/components/auth/AuthListener";
import { Suspense } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dokkhota IT - Best IT Training Platform in Bangladesh",
    template: "%s | Dokkhota IT",
  },
  description:
    "Master in-demand tech skills with Dokkhota IT. Bangladesh's premier platform for Web Development, App Development, and AI courses with expert mentorship and job placement support.",
  keywords: [
    "Dokkhota IT",
    "DokkhotaIT",
    "IT Training Bangladesh",
    "Best IT Coaching BD",
    "Web Development Course",
    "App Development",
    "Programming",
    "React",
    "Next.js",
    "MERN Stack",
    "Job Placement",
    "Skill Development",
    "Online Courses BD"
  ],
  authors: [{ name: "Dokkhota IT Team" }],
  creator: "Dokkhota IT",
  publisher: "Dokkhota IT",
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://dokkhotait.com",
    siteName: "Dokkhota IT",
    title: "Dokkhota IT - Best IT Training Platform in Bangladesh",
    description:
      "Master in-demand tech skills with Dokkhota IT. Bangladesh's premier platform for Web Development, App Development, and AI courses.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dokkhota IT - Empowering Future",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dokkhota IT - Best IT Training Platform in Bangladesh",
    description:
      "Master in-demand tech skills with Dokkhota IT. Bangladesh's premier platform for Web Development, App Development, and AI courses.",
    creator: "@DokkhotaIT",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://dokkhotait.com"),
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Manually load messages since the plugin is disabled
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error("Failed to load messages:", error);
    notFound();
  }

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${hindSiliguri.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
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
      </body>
    </html>
  );
}
