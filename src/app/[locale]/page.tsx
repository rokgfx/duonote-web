"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import PublicHeader from "@/components/layout/PublicHeader";
import Fox from "@/components/ui/Fox";
import Divider from "@/components/ui/Divider";
import FeatureNotes from "@/components/ui/FeatureNotes";
import FeatureSearch from "@/components/ui/FeatureSearch";
import FeatureOffline from "@/components/ui/FeatureOffline";
import Footer from "@/components/layout/Footer";


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
      <div className="pt-[80px]">
        <div className="container max-w-7xl mx-auto px-4 flex gap-10 mt-14 md:mt-20 flex-col md:flex-row">
          <div className="flex-1">
            <Fox className="h-96 justify-self-start md:w-full" />
          </div>
          <div className="w-full md:w-[60%] font-host-grotesk text-base-content flex flex-col justify-end">
            <h1 className="text-5xl/13 mb-4 font-bold">
              {t("title")}
            </h1>
            <p className="text-2xl/9 font-regular mb-6">
              {t("description")}
            </p>
            <button className="mt-4 btn btn-primary btn-xl text-2xl w-fit px-16 self-center md:self-start">
              {t("cta.clickHereToGetStarted")}
            </button>
            
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="mt-14 md:mt-28 bg-base-200 py-16 font-host-grotesk">
        <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row">
          
          <div className="w-full md:w-1/3 flex flex-col lg:pr-18 md:pr-10 mb-14 md:mb-0">
            
            <FeatureNotes className="w-[70%] md:w-full md:mb-2 self-center"/>
            <div className="h-14 md:h-24 flex items-end">
              <h3 className="mt-[5rem] text-3xl font-bold text-base-content">{t("features.bilingual")}</h3>
            </div>
            <Divider />
            <p className="mt-2 text-base-content text-xl">{t("features.bilingualDesc")}</p>
          </div>
          
          <div className="w-full md:w-1/3 flex flex-col lg:pl-9 lg:pr-9 md:pl-5 md:pr-5 mb-14 md:mb-0">
            
            <FeatureSearch className="w-[70%] md:w-full md:mb-2 self-center"/>
            <div className="h-14 md:h-24 flex items-end">
              <h3 className="text-3xl font-bold text-base-content">{t("features.smart")}</h3>
            </div>
            <Divider />
            <p className="mt-2 text-base-content text-xl">{t("features.smartDesc")}</p>
          </div>

          <div className="w-full md:w-1/3 flex flex-col lg:pl-18 md:pl-10 mb-14 md:mb-0">
            
            <FeatureOffline className="w-[70%] md:w-full md:mb-2 self-center"/>
            <div className="h-14 md:h-24 flex items-end">
              <h3 className="text-3xl font-bold text-base-content">{t("features.offline")}</h3>
            </div>
            <Divider />
            <p className="mt-2 text-base-content text-xl">{t("features.offlineDesc")}</p>
          </div>
        
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
