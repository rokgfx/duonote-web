import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { AbstractIntlMessages } from 'next-intl';

export const locales = ['en', 'ja', 'es', 'fr', 'de', 'zh', 'ko', 'pt', 'it'] as const;
export const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  const baseLocale = locale || defaultLocale;

  if (!locales.includes(baseLocale as (typeof locales)[number])) {
    notFound();
  }

  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`../locales/${baseLocale}.json`)).default;
  } catch {
    notFound();
  }

  return {
    locale: baseLocale,
    messages
  };
});
