"use client";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-4 text-center">Main Page</h1>
      <p className="text-gray-600 text-center">
        You have successfully logged in.
      </p>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
      >
        Logout
      </button>
    </div>
  );
}
