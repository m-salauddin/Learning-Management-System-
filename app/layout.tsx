import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { ToastProvider } from "@/components/ui/toast";
import { SocialLoginToast } from "@/components/auth/SocialLoginToast";
import { AuthListener } from "@/components/auth/AuthListener";
import { Suspense } from "react";
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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Strip browser extension attributes (Bitdefender bis_skin_checked, etc.) before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  var a=['bis_skin_checked','bis_size','bis_id','bis_register'];
  function c(el){for(var i=0;i<a.length;i++)el.removeAttribute(a[i]);}
  document.querySelectorAll('[bis_skin_checked],[bis_size],[bis_id],[bis_register]').forEach(c);
  new MutationObserver(function(ms){
    for(var i=0;i<ms.length;i++){
      var m=ms[i];
      if(m.type==='attributes'&&a.indexOf(m.attributeName)>-1){
        m.target.removeAttribute(m.attributeName);
      }
      if(m.type==='childList'){
        for(var j=0;j<m.addedNodes.length;j++){
          var n=m.addedNodes[j];
          if(n.nodeType===1){
            c(n);
            var d=n.querySelectorAll&&n.querySelectorAll('[bis_skin_checked],[bis_size]');
            if(d)d.forEach(c);
          }
        }
      }
    }
  }).observe(document.documentElement,{attributes:true,attributeFilter:a,subtree:true,childList:true});
})();
`,
          }}
        />
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
      </body>
    </html >
  );
}
