import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type {AbstractIntlMessages} from 'next-intl';

// Define the locales you want to support
export const locales = ['en'] as const; // Using "as const" for stricter typing
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // The `locale` parameter from `getRequestConfig` can be undefined
  // if a locale cannot be determined. We must handle this.
  const baseLocale = locale || defaultLocale;

  // Validate that the incoming `locale` parameter is valid.
  // If locale was undefined and defaultLocale is used, this check is still good.
  if (!locales.includes(baseLocale as typeof locales[number])) {
    notFound();
  }

  let messages: AbstractIntlMessages;

  // Select the appropriate locale based on baseLocale
  if (baseLocale === 'en') {
    messages = (await import(`../locales/${baseLocale}.json`)).default;
  } else {
    notFound(); // Handle unsupported locales
  }

  return {
    locale: baseLocale, // Ensure the resolved locale is returned
    messages
  };
});
