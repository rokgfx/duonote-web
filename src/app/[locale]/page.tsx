import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { locales } from '../lib/i18n';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';

interface HomePageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function HomePage({ params }: HomePageProps) {

  const { locale } = await params;
  
  const t = await getTranslations({ locale, namespace: 'General' });

  return (
    <div>
       <LocaleSwitcher />
       <Link href={`/${locale}/login`}>
        {t('text')}
      </Link>
    </div>
  );
}
