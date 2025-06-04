"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import PublicHeader from "@/components/layout/PublicHeader";
import FoxHero from "@/components/ui/FoxHero";

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const t = useTranslations("HomePage");

  const locale = params.locale as string;

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace(`/${locale}/app`);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, locale]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <PublicHeader />

      {/* Main Content Container */}
      <div className="pt-[90px]">
        <div className="container max-w-6xl mx-auto bg-red-500 min-h-96 px-4 flex items-center">
          <div className="flex-1">
            <FoxHero className="w-full max-w-md" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-white/90">
              {t("description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
