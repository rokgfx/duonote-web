"use client";
import React, { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { getAuthErrorMessage } from "@/app/lib/auth-errors";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!auth) {
        setError("Auth is not initialized.");
        setLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.push(`/${params.locale}/app`);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      if (!auth) {
        setError("Auth is not initialized.");
        setLoading(false);
        return;
      }
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(`/${params.locale}/app`);
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
    setLoading(false);
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center flex-1 bg-gray-50">
        <div className="w-full max-w-sm p-6 bg-white rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 bg-zinc-100 border-solid border-zinc-300 rounded"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 bg-zinc-100 border-solid border-zinc-300 rounded"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="my-4 flex items-center">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-xs">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.13 2.36 30.45 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.13 13.09 17.56 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.19 5.59C43.98 37.13 46.1 31.3 46.1 24.55z"/>
                <path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.93.94 7.65 2.69 10.89l7.98-6.2z"/>
                <path fill="#EA4335" d="M24 48c6.45 0 12.13-2.13 16.19-5.81l-7.19-5.59c-2.01 1.35-4.59 2.16-9 2.16-6.44 0-11.87-3.59-14.33-8.79l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            Continue with Google
          </button>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="../register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
