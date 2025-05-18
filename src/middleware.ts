import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './app/lib/i18n'; // Path to your i18n config

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales, // Will use ['en'] from i18n.ts

  // Used when no locale matches
  defaultLocale: defaultLocale, // Will use 'en'

  localePrefix: 'as-needed',

  // pathnames: ['/api'], // Example: pathnames that should not be internationalized
});

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico|images).*)']
};
