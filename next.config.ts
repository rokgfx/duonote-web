import type { NextConfig } from "next";
import withNextIntl from 'next-intl/plugin';
import { locales } from './src/app/lib/i18n';

// Create the withNextIntl higher-order function
const withNextIntlConfig = withNextIntl('./src/app/lib/i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://100.88.94.81:3000",
    "https://duonote.com",
    "http://duonote.com",
    "https://duonote.com:3000",
    "http://duonote.com:3000",
    "duonote.com",
    "duonote.com:3000"
  ],
  devIndicators: false
};

// Apply the withNextIntl higher-order function to the Next.js config
export default withNextIntlConfig(nextConfig);
