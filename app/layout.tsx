import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SkillSyncBD - Learn. Build. Succeed.",
    template: "%s | SkillSyncBD",
  },
  description:
    "Bangladesh's premier EdTech platform. Master in-demand skills with expert-led courses, real-world projects, and job placement support.",
  keywords: [
    "SkillSyncBD",
    "Bangladesh",
    "EdTech",
    "Online Courses",
    "Web Development",
    "Programming",
    "React",
    "Next.js",
    "Spring Boot",
    "Job Placement",
  ],
  authors: [{ name: "SkillSyncBD Team" }],
  creator: "SkillSyncBD",
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://skillsyncbd.com",
    siteName: "SkillSyncBD",
    title: "SkillSyncBD - Learn. Build. Succeed.",
    description:
      "Bangladesh's premier EdTech platform. Master in-demand skills with expert-led courses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillSyncBD - Learn. Build. Succeed.",
    description:
      "Bangladesh's premier EdTech platform. Master in-demand skills with expert-led courses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
