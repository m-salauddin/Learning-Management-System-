import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/intl.ts');

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      {
        protocol: "https",
        hostname: "ixbhljtotgsqkzbkucuc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
  serverExternalPackages: ["@supabase/ssr", "@supabase/supabase-js"],
};

export default withNextIntl(nextConfig);




