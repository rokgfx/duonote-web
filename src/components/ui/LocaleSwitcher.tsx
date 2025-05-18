'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/app/lib/i18n'; // Using path alias from tsconfig

function getPathWithoutLocale(pathname: string, locales: readonly string[]) {
  // Remove the leading locale segment from the pathname (e.g., '/ja/foo' -> '/foo')
  const segments = pathname.split('/');
  if (locales.includes(segments[1])) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}

export default function LocaleSwitcher() {
  const pathname = usePathname();

  // Find current locale in path (e.g., '/ja/foo')
  const currentLocale = pathname.split('/')[1];
  const pathWithoutLocale = getPathWithoutLocale(pathname, locales);

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: 16 }}>
      {locales
        .filter((locale) => locale !== currentLocale)
        .map((locale) => (
          <Link
            key={locale}
            href={`/${locale}${pathWithoutLocale}`}
            prefetch={false}
          >
            {locale === 'en' ? 'English' : '日本語'}
          </Link>
        ))}
    </div>
  );
}
