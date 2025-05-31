"use client";
import React from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { WifiIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function OfflineIndicator() {
  const isOnline = useNetworkStatus();

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="alert alert-warning shadow-lg fixed top-20 left-4 right-4 z-40 max-w-sm mx-auto">
      <ExclamationTriangleIcon className="h-5 w-5" />
      <div>
        <h3 className="font-bold">Offline Mode</h3>
        <div className="text-xs">Changes will sync when connection is restored</div>
      </div>
    </div>
  );
}