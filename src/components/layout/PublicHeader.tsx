import React from "react";
import DuonoteLogo from "@/components/ui/DuonoteLogo";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function PublicHeader() {
  return (
    <div className="navbar fixed top-0 z-50 h-[100px] bg-base-100">
      <div className="max-w-6xl mx-auto w-full px-4">
        <div className="navbar-start">
          <DuonoteLogo className="h-11" />
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <GlobeAltIcon className="h-5 w-5" />
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li><a>English</a></li>
              <li><a>Español</a></li>
              <li><a>Français</a></li>
              <li><a>Deutsch</a></li>
              <li><a>中文</a></li>
              <li><a>日本語</a></li>
              <li><a>한국어</a></li>
              <li><a>Português</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}