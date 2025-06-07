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
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 bg-base-200 flex justify-center text-base-content">
                <div className="w-full pt-30 pb-4">
                  {children}
                </div>
              </main>
            </div>
          </SearchProvider>
        </NotebookProvider>
      </NavigationProvider>
    </ModalProvider>
  );
}
