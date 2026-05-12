import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['en', 'bn'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();
  
  // 1. Check cookie
  let locale = cookieStore.get('NEXT_LOCALE')?.value;
  
  // 2. Check Accept-Language header
  if (!locale) {
    const acceptLanguage = headerStore.get('accept-language');
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
      if ((locales as readonly string[]).includes(preferredLocale)) {
        locale = preferredLocale;
      }
    }
  }
  
  // 3. Fallback to default
  if (!locale || !(locales as readonly string[]).includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    timeZone: 'Asia/Dhaka',
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
