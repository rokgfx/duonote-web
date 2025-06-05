"use client";
import React from "react";
import DuonoteLogoAlt from "@/components/ui/DuonoteLogoAlt";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-base-content py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Logo and navigation links above the line */}
        <div className="flex justify-between items-center mb-2">
          <DuonoteLogoAlt className="h-8" />
          <nav className="flex space-x-6">
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

        {/* Thin gray line */}
        <div className="border-t border-base-100/15 mb-6"></div>

        {/* Description centered */}
        <div className="text-center mb-6">
          <p className="text-base-100/80 text-base leading-relaxed max-w-xl mx-auto">
            Duonote is a bilingual vocabulary and dictionary app designed to help language learners 
            build their vocabulary effectively through smart note-taking and spaced repetition.
          </p>
        </div>

        {/* Copyright centered at bottom */}
        <div className="text-center">
          <p className="text-base-100/60 text-sm">
            © 2025 Duonote. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}