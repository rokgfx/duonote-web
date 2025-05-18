import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { locales } from '../lib/i18n';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

interface HomePageProps {
  params: { locale: string };
}

// Add the generateStaticParams function to pre-render pages for each locale
export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function HomePage({ params }: HomePageProps) {
  // Await the params object to get the locale
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  console.log('Current locale from URL params:', locale); // Debug log
  
  // Get translations for the current locale with explicit locale
  const t = await getTranslations({ locale, namespace: 'General' });
  console.log('Translation for "text":', t('text')); // Debug log

  return (
    <div>
       <LocaleSwitcher />
       <Link href={`/${locale}/login`}>
        {t('text')}
      </Link>
    </div>
  );
}
