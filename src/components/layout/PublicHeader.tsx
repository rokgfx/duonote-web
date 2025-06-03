import React from "react";
import DuonoteLogo from "@/components/ui/DuonoteLogo";

export default function PublicHeader() {
  return (
    <div className="navbar fixed top-0 z-50 h-[100px] bg-base-100">
      <div className="max-w-6xl mx-auto w-full px-4">
        <div className="navbar-start">
          <DuonoteLogo className="h-11" />
        </div>
      </div>
    </div>
  );
}