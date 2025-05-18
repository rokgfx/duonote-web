import { getTranslations } from 'next-intl/server';

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  const t = await getTranslations('LoginPage');

  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}