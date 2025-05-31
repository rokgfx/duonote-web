"use client";
import React from "react";
import SearchInput from "@/components/ui/SearchInput";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full bg-base-100 border-t z-40 sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
      <div className="p-4">
        <SearchInput />
      </div>
    </footer>
  );
}