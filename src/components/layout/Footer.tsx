"use client";
import React from "react";
import DuonoteLogoAlt from "@/components/ui/DuonoteLogoAlt";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-base-content py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Navigation links for small screens - full width */}
        <nav className="flex justify-center gap-10 mb-2 md:hidden">
          <Link 
            href="/" 
            className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors text-center"
          >
            Home
          </Link>
          <Link 
            href="/why-duonote" 
            className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors text-center"
          >
            Why Duonote?
          </Link>
          <Link 
            href="/faq" 
            className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors text-center"
          >
            FAQ
          </Link>
          <Link 
            href="/register" 
            className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors text-center"
          >
            Sign Up
          </Link>
        </nav>

        {/* Logo and navigation links above the line - md and up */}
        <div className="hidden md:flex justify-between items-center mb-2">
          <DuonoteLogoAlt className="h-8" />
          <nav className="flex space-x-10">
            <Link 
              href="/" 
              className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors"
            >
              Why Duonote?
            </Link>
            <Link 
              href="/help" 
              className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors"
            >
              Help
            </Link>
            <Link 
              href="/register" 
              className="text-base-100/80 hover:text-base-100 text-base font-medium transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>

        {/* Thin gray line - md and up */}
        <div className="border-t border-base-100/15 mb-6"></div>

        {/* Description centered */}
        <div className="text-center mb-6">
          <p className="text-base-100/50 text-sm leading-relaxed max-w-xl mx-auto">
            Duonote is a bilingual vocabulary and dictionary app designed to help language learners 
            build their vocabulary effectively through smart note-taking and spaced repetition.
          </p>
        </div>

        {/* Copyright centered at bottom */}
        <div className="text-center mb-6 md:mb-0">
          <p className="text-base-100/30 text-sm">
            © 2025 Duonote. All rights reserved.
          </p>
        </div>

        {/* Logo at bottom for small screens */}
        <div className="text-center md:hidden">
          <DuonoteLogoAlt className="h-8 mx-auto" />
        </div>
      </div>
    </footer>
  );
}