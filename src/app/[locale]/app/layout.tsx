"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { SearchProvider } from "@/contexts/SearchContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { NotebookProvider } from "@/contexts/NotebookContext";
import { ModalProvider } from "@/contexts/ModalContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.replace("/");
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        router.replace("/");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <ModalProvider>
      <NavigationProvider>
        <NotebookProvider>
          <SearchProvider>
            <Header />
            <main className="pt-20 pb-4 min-h-screen flex justify-center bg-base-200">
              {children}
            </main>
          </SearchProvider>
        </NotebookProvider>
      </NavigationProvider>
    </ModalProvider>
  );
}
