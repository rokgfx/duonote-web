'use client';

import React from "react";
import DuonoteLogo from "@/components/ui/DuonoteLogo";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/app/lib/i18n';
import 'flag-icons/css/flag-icons.min.css';

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
    case 'es':
      return 'Español';
    case 'fr':
      return 'Français';
    case 'de':
      return 'Deutsch';
    case 'zh':
      return '中文';
    case 'ko':
      return '한국어';
    case 'pt':
      return 'Português';
    case 'it':
      return 'Italiano';
    case 'vi':
      return 'Tiếng Việt';
    default:
      return locale;
  }
}

function getCountryCode(locale: string) {
  switch (locale) {
    case 'en':
      return 'us';
    case 'ja':
      return 'jp';
    case 'es':
      return 'es';
    case 'fr':
      return 'fr';
    case 'de':
      return 'de';
    case 'zh':
      return 'cn';
    case 'ko':
      return 'kr';
    case 'pt':
      return 'pt';
    case 'it':
      return 'it';
    case 'vi':
      return 'vn';
    default:
      return 'us';
  }
}

function handleLocaleChange(newLocale: string) {
  // Update localStorage with the new locale preference
  localStorage.setItem('preferredLocale', newLocale);
}

export default function PublicHeader() {
  const pathname = usePathname();

  // Find current locale in path (e.g., '/ja/foo')
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  const currentLocale = locales.includes(potentialLocale as typeof locales[number]) ? (potentialLocale as typeof locales[number]) : 'en';
  const pathWithoutLocale = getPathWithoutLocale(pathname, locales);

  const supportedLocales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'vi'];

  return (
    <div className="navbar fixed top-0 z-50 h-[80px] bg-base-100 border-b border-neutral">
      <div className="max-w-7xl mx-auto w-full px-4">
        <div className="navbar-start">
          <Link href="/">
            <DuonoteLogo className="h-11 mt-2" />
          </Link>
        </div>
        <div className="navbar-end">
          <div className="hidden md:flex items-center gap-6 mr-4">
            <Link href="/about" className="btn btn-ghost btn-sm text-base">Why Duonote?</Link>
            <Link href="/help" className="btn btn-ghost btn-sm text-base">Help</Link>
            <Link href={`/${currentLocale}/login`} className="btn btn-ghost btn-sm text-base">Login</Link>
          
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
              <span className="text-base font-medium">{getLocaleLabel(currentLocale)}</span>
              <GlobeAltIcon className="h-5 w-5" />
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl text-base border border-neutral">
              {supportedLocales.map((locale) => (
                <li key={locale}>
                  <Link
                    href={`/${locale}${pathWithoutLocale}`}
                    prefetch={false}
                    className={`flex items-center justify-between ${locale === currentLocale ? 'active' : ''}`}
                    onClick={() => handleLocaleChange(locale)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`fi fi-${getCountryCode(locale)} w-5 h-4 border border-neutral rounded-[4px]`}></span>
                      <span>{getLocaleLabel(locale)}</span>
                    </div>
                    {locale === currentLocale && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}