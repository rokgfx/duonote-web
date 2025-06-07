import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './app/lib/i18n';

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale,
  
  // Set the locale for requests based on the pathname
  localePrefix: 'as-needed',
  localeDetection: true
});

// Export the next-intl middleware directly
export default intlMiddleware;

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico|images).*)']
};
