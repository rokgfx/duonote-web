'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/app/lib/i18n';

function getPathWithoutLocale(pathname: string, locales: readonly string[]) {
  // Remove the leading locale segment from the pathname (e.g., '/ja/foo' -> '/foo')
  const segments = pathname.split('/');
  if (locales.includes(segments[1])) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}

function getLocaleLabel(locale: string) {
  switch (locale) {
    case 'en':
      return 'English';
    case 'ja':
      return '日本語';
    default:
      return locale;
  }
}

function getLocaleFlag(locale: string) {
  switch (locale) {
    case 'en':
      return '🇺🇸';
    case 'ja':
      return '🇯🇵';
    default:
      return '🌐';
  }
}

export default function LocaleSwitcher() {
  const pathname = usePathname();

  // Find current locale in path (e.g., '/ja/foo')
  const currentLocale = pathname.split('/')[1];
  const pathWithoutLocale = getPathWithoutLocale(pathname, locales);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
        <span>{getLocaleFlag(currentLocale)}</span>
        <span className="hidden sm:inline">{getLocaleLabel(currentLocale)}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={`/${locale}${pathWithoutLocale}`}
              prefetch={false}
              className={`flex items-center gap-3 ${locale === currentLocale ? 'active' : ''}`}
            >
              <span>{getLocaleFlag(locale)}</span>
              <span>{getLocaleLabel(locale)}</span>
              {locale === currentLocale && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
