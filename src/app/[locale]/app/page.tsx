"use client";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase";
import NotesList from "@/components/notes/NotesList";
import SettingsPage from "@/components/pages/SettingsPage";
import { generateDummyNotes } from "@/utils/generateDummyNotes";
import { useSearchContext } from "@/contexts/SearchContext";
import { useNavigation } from "@/contexts/NavigationContext";

export default function MainPage() {
  const [user] = useAuthState(auth!);
  const [generating, setGenerating] = useState(false);
  const { searchQuery } = useSearchContext();
  const { currentPage, goToNotes } = useNavigation();

  const handleGenerateDummyNotes = async () => {
    if (!user) return;
    
    setGenerating(true);
    try {
      await generateDummyNotes(user.uid, 25); // Generate 25 dummy notes
      console.log("Dummy notes generated successfully!");
    } catch (error) {
      console.error("Failed to generate dummy notes:", error);
    } finally {
      setGenerating(false);
    }
  };

  // Render different pages based on current navigation state
  if (currentPage === 'settings') {
    return <SettingsPage onBackToNotes={goToNotes} />;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Temporary button for generating dummy data */}
      <div className="mb-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
        <button
          onClick={handleGenerateDummyNotes}
          disabled={generating}
          className="btn btn-warning btn-sm"
        >
          {generating ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Generating...
            </>
          ) : (
            "Generate 25 Dummy Notes"
          )}
        </button>
      </div>

      <NotesList searchQuery={searchQuery} />
    </div>
  );
}
