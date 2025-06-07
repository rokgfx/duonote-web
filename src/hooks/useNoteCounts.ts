"use client";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/lib/firebase";

export function useNoteCounts() {
  const [noteCounts, setNoteCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth!);

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    try {
      // Listen to all user's notes to track counts per notebook
      const notesQuery = query(
        collection(db, "notes"),
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(
        notesQuery,
        (snapshot) => {
          const counts: Record<string, number> = {};
          
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            const notebookId = data.notebookId || 'unassigned';
            counts[notebookId] = (counts[notebookId] || 0) + 1;
          });
          
          setNoteCounts(counts);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching note counts:", err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up note counts listener:", err);
      setLoading(false);
    }
  }, [user]);

  const getNoteCount = (notebookId: string) => {
    return noteCounts[notebookId] || 0;
  };

  return { noteCounts, getNoteCount, loading };
}