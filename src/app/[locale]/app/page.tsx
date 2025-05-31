"use client";
import React from "react";
import NotesList from "@/components/notes/NotesList";

export default function MainPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <NotesList />
    </div>
  );
}
