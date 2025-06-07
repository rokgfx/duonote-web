"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { getAuthErrorMessage } from "@/app/lib/auth-errors";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import PublicHeader from "@/components/layout/PublicHeader";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    
    if (password !== confirmPassword) {
      setError(getAuthErrorMessage({ code: 'passwords-do-not-match' }));
      setLoading(false);
      return;
    }
    
    try {
      if (!auth) {
        setError("Auth is not initialized.");
        setLoading(false);
        return;
      }
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      if (!auth) {
        setError("Auth is not initialized.");
        setLoading(false);
        return;
      }
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess(true);
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    }
    setLoading(false);
  };

  return (
    <>
      <PublicHeader />
      <main className="flex flex-col items-center justify-center flex-1 bg-base-200 pt-[80px] pb-16">
        <div className="w-full max-w-lg px-6 mt-8">
          <h1 className="text-4xl font-bold mb-6 text-center text-base-content font-host-grotesk">Sign up for Duonote</h1>
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="btn btn-outline w-full flex items-center justify-center gap-3 mt-8"
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
          <div className="my-8">
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-base-content/20"></div>
              <span className="px-4 text-base-content/60 text-lg font-medium">OR</span>
              <div className="flex-1 border-t border-base-content/20"></div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="input w-full"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="input w-full"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success">
                <span>Registration successful! You can now log in.</span>
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full mt-8"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>
          <div className="mt-8 text-center text-lg">
            <span className="text-base-content/70">Already have an account?{" "}</span>
            <Link href="../login" className="link link-primary font-medium">
              Login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
