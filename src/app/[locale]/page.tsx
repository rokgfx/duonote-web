"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

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
      
    </div>
  );
}
