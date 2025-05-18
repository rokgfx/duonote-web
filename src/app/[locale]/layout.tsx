// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl'; // Removed useMessages
import { notFound } from 'next/navigation';
import { Inter } from "next/font/google"; // Example font, you can change this
import "./globals.css"; // Assuming globals.css is in src/app/
import { locales } from '../lib/i18n'; // Assuming i18n.ts is in src/ and exports locales
                                   // and your tsconfig.json paths alias @/* to src/*

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Duonote",
  description: "Your personal bilingual dictionary. Perfect for language learners.",
};

// This function helps Next.js know which locales are supported
// and can statically generate routes for them if applicable.
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string; // 'locale' is a string, directly available
  };
}

// Make the RootLayout an async function

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  // Validate the locale here as well, or rely on middleware + i18n.ts
  // For robustness, a check here is good.
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  let messages;
  try {
    // Dynamically import the messages for the current locale.
    // The path is relative to this file, going up to src/ and then into locales/.
    // If your i18n.ts is in src/i18n.ts and messages in src/locales/
    messages = (await import(`../locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    // If messages for a supported locale are missing, trigger a 404.
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/*
          NextIntlClientProvider is essential for making translations
          available to Client Components deeper in the tree.
          It receives the messages loaded here in the Server Component layout.
        */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
