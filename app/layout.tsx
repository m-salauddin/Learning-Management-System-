import { Space_Grotesk, JetBrains_Mono, Hind_Siliguri } from "next/font/google";
import { getLocale, getMessages, getTimeZone } from 'next-intl/server';
import { Providers } from "./providers";
import type { Metadata } from "next";
import "./globals.css";

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
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = await getTimeZone();

  return (
    <html 
      lang={locale} 
      className={`${spaceGrotesk.variable} ${hindSiliguri.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="antialiased" suppressHydrationWarning>
        <Providers locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
