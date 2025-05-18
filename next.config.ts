import type { NextConfig } from "next";
import withNextIntl from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://100.88.94.81:3000",
  ],
};

const i18nConfigured = withNextIntl('./src/app/lib/i18n.ts')(nextConfig);

export default i18nConfigured;