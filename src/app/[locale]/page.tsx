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
        <div className="container max-w-7xl mx-auto px-4 flex gap-10 mt-12 flex-col md:flex-row">
          <div className="flex-1">
            <FoxHero className="h-96 justify-self-center md:w-full" />
          </div>
          <div className="w-full md:w-[60%] font-host-grotesk text-base-content flex flex-col justify-end">
            <h1 className="text-5xl/13 mb-4 font-bold">
              {t("title")}
            </h1>
            <p className="text-2xl/9 font-regular mb-6">
              {t("description")}
            </p>
            <button className="mt-4 btn btn-primary btn-xl text-2xl w-fit px-16 self-center md:self-start">
              Click here to get started
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
