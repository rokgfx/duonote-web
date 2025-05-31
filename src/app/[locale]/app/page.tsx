"use client";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import NotesList from "@/components/notes/NotesList";
import SettingsPage from "@/components/pages/SettingsPage";
import ProfilePage from "@/components/pages/ProfilePage";
import { generateDummyNotes } from "@/utils/generateDummyNotes";
import { useSearchContext } from "@/contexts/SearchContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useNotebooks } from "@/contexts/NotebookContext";

export default function MainPage() {
  const [user] = useAuthState(auth!);
  const [generating, setGenerating] = useState(false);
  const [deletingNotes, setDeletingNotes] = useState(false);
  const [deletingNotebooks, setDeletingNotebooks] = useState(false);
  const { searchQuery } = useSearchContext();
  const { currentPage, goToNotes } = useNavigation();
  const { notebooks, currentNotebook } = useNotebooks();

  const handleGenerateDummyNotes = async () => {
    if (!user) return;
    
    setGenerating(true);
    try {
      await generateDummyNotes(user.uid, 25, currentNotebook?.id); // Generate 25 dummy notes
      console.log("Dummy notes generated successfully!");
    } catch (error) {
      console.error("Failed to generate dummy notes:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteAllNotes = async () => {
    if (!user || !db) return;

    const confirmDelete = confirm(
      "⚠️ This will permanently delete ALL your notes! This action cannot be undone. Are you sure?"
    );
    
    if (!confirmDelete) return;

    setDeletingNotes(true);
    
    try {
      // Get all user's notes
      const notesQuery = query(
        collection(db, "notes"),
        where("userId", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(notesQuery);
      
      // Delete all notes in batches
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log(`Deleted ${querySnapshot.size} notes`);
      alert(`Successfully deleted ${querySnapshot.size} notes`);
    } catch (error) {
      console.error("Failed to delete notes:", error);
      alert("Failed to delete notes. Please try again.");
    } finally {
      setDeletingNotes(false);
    }
  };

  const handleDeleteAllNotebooks = async () => {
    if (!user || !db) return;

    const confirmDelete = confirm(
      "⚠️ This will permanently delete ALL your notebooks! This action cannot be undone. Are you sure?"
    );
    
    if (!confirmDelete) return;

    setDeletingNotebooks(true);
    
    try {
      // Get all user's notebooks
      const notebooksQuery = query(
        collection(db, "notebooks"),
        where("userId", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(notebooksQuery);
      
      // Delete all notebooks in batches
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log(`Deleted ${querySnapshot.size} notebooks`);
      alert(`Successfully deleted ${querySnapshot.size} notebooks`);
    } catch (error) {
      console.error("Failed to delete notebooks:", error);
      alert("Failed to delete notebooks. Please try again.");
    } finally {
      setDeletingNotebooks(false);
    }
  };

  // Render different pages based on current navigation state
  if (currentPage === 'settings') {
    return <SettingsPage onBackToNotes={goToNotes} />;
  }

  if (currentPage === 'profile') {
    return <ProfilePage onBackToNotes={goToNotes} />;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Debug buttons for development */}
      <div className="mb-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
        <div className="text-sm font-medium mb-3 text-warning-content">
          🔧 Debug Tools (Development Only)
        </div>
        <div className="flex flex-wrap gap-2">
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
          
          <button
            onClick={handleDeleteAllNotes}
            disabled={deletingNotes}
            className="btn btn-error btn-sm"
          >
            {deletingNotes ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete All Notes"
            )}
          </button>
          
          <button
            onClick={handleDeleteAllNotebooks}
            disabled={deletingNotebooks || notebooks.length === 0}
            className="btn btn-error btn-sm"
            title={notebooks.length === 0 ? "No notebooks to delete" : "Delete all notebooks"}
          >
            {deletingNotebooks ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete All Notebooks"
            )}
          </button>
        </div>
        <div className="text-xs text-warning-content/60 mt-2">
          ⚠️ Deletion actions are permanent and cannot be undone
        </div>
      </div>

      <NotesList searchQuery={searchQuery} />
    </div>
  );
}
