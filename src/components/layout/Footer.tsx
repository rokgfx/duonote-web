"use client";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full bg-base-100 border-t z-40 sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            className="input input-bordered w-full pl-10"
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </footer>
  );
}