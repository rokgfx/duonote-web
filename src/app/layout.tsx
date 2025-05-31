import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Duonote",
  description: "Your personal bilingual dictionary. Perfect for language learners.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}