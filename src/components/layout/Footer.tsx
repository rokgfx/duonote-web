"use client";
import React from "react";
import DuonoteLogoAlt from "@/components/ui/DuonoteLogoAlt";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-base-content py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left side - Logo, description, and copyright */}
          <div className="space-y-6">
            <DuonoteLogoAlt className="h-8" />
            <p className="text-base-100/80 text-base leading-relaxed max-w-md">
              Duonote is a bilingual vocabulary and dictionary app designed to help language learners 
              build their vocabulary effectively through smart note-taking and spaced repetition.
            </p>
            <p className="text-base-100/60 text-sm">
              © 2025 Duonote. All rights reserved.
            </p>
          </div>

          {/* Right side - Navigation links */}
          <div className="flex flex-col space-y-4 lg:items-end">
            <nav className="flex flex-col space-y-3 pl-10 border-l border-base-100/20">
              <Link 
                href="/" 
                className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/why-duonote" 
                className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors"
              >
                Why Duonote?
              </Link>
              <Link 
                href="/faq" 
                className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors"
              >
                FAQ
              </Link>
              <Link 
                href="/register" 
                className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}