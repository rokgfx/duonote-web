"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/lib/firebase";

interface Note {
  id: string;
  content1: string;
  content2: string;
  createdAt: any;
  userId: string;
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth!);

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    try {
      // Create query to get user's notes ordered by creation date (newest first)
      const notesQuery = query(
        collection(db, "notes"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      // Listen for real-time updates
      const unsubscribe = onSnapshot(
        notesQuery,
        (snapshot) => {
          const notesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Note[];
          
          setNotes(notesData);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching notes:", err);
          setError("Failed to load notes");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up notes listener:", err);
      setError("Failed to load notes");
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60 text-lg">No notes yet</p>
        <p className="text-base-content/40 text-sm mt-2">
          Create your first note to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {notes.map((note) => (
        <div key={note.id} className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            {/* Content 1 - Top half */}
            <div className="mb-3 pb-3 border-b border-base-300">
              <div className="text-base leading-relaxed">{note.content1}</div>
            </div>
            
            {/* Content 2 - Bottom half */}
            <div>
              <div className="text-base leading-relaxed">{note.content2}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}