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
        <div className="container max-w-7xl mx-auto px-4 flex bg-yellow-200">
          <div className="flex-1 bg-red-200">
            <FoxHero className="w-full" />
          </div>
          <div className="w-[60%] bg-green-200 font-host-grotesk text-base-content flex flex-col justify-end">
            <h1 className="text-5xl/13 mb-4 font-bold">
              {t("title")}
            </h1>
            <p className="text-2xl/9 font-regular">
              {t("description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
