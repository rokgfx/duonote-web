"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/lib/firebase";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function AddNoteModal({ isOpen, onClose, onSave }: AddNoteModalProps) {
  const [content1, setContent1] = useState("");
  const [content2, setContent2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth!);
  const isOnline = useNetworkStatus();

  const MAX_CHARS = 150;

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setContent1("");
      setContent2("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  // Count characters properly handling multibyte characters
  const getCharacterCount = (text: string) => {
    return Array.from(text).length;
  };

  const handleContent1Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (getCharacterCount(text) <= MAX_CHARS) {
      setContent1(text);
    }
  };

  const handleContent2Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (getCharacterCount(text) <= MAX_CHARS) {
      setContent2(text);
    }
  };

  const content1Count = getCharacterCount(content1);
  const content2Count = getCharacterCount(content2);

  const handleSave = async () => {
    setError("");
    
    // Validation
    if (!content1.trim() || !content2.trim()) {
      setError("Both content fields are required.");
      return;
    }

    if (getCharacterCount(content1) > MAX_CHARS) {
      setError(`Content 1 exceeds ${MAX_CHARS} characters.`);
      return;
    }

    if (getCharacterCount(content2) > MAX_CHARS) {
      setError(`Content 2 exceeds ${MAX_CHARS} characters.`);
      return;
    }

    if (!user || !db) {
      setError("User not authenticated or database not available.");
      return;
    }

    setLoading(true);

    try {
      // Use different timestamps based on online/offline status
      const timestamp = isOnline ? serverTimestamp() : Timestamp.now();
      
      // Create the note document
      const noteData = {
        userId: user.uid,
        content1: content1.trim(),
        content2: content2.trim(),
        createdAt: timestamp,
        updatedAt: timestamp,
        createdOffline: !isOnline,
      };

      if (!isOnline) {
        // In offline mode, add with timeout to avoid hanging
        const addDocPromise = addDoc(collection(db, "notes"), noteData);
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Offline save timeout")), 2000);
        });
        
        // Race between the addDoc and timeout
        try {
          await Promise.race([addDocPromise, timeoutPromise]);
        } catch (timeoutError) {
          // If it times out, that's OK in offline mode - it's likely saved locally
          console.log("Save operation timed out (expected in offline mode) - data cached locally");
        }
      } else {
        // Online mode - normal operation
        await addDoc(collection(db, "notes"), noteData);
      }

      // Reset form and close modal
      setContent1("");
      setContent2("");
      setError("");
      onSave();
      onClose();
      
      if (isOnline) {
        console.log("Note saved to Firestore");
      } else {
        console.log("Note saved locally - will sync when online");
      }
    } catch (err) {
      console.error("Error saving note:", err);
      setError(`Failed to save note${!isOnline ? ' (offline)' : ''}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Note</h3>
        <div className="py-4 space-y-4">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <div>
            <label className="label">
              <span className="label-text">Content 1</span>
              <span className="label-text-alt text-sm">
                {content1Count}/{MAX_CHARS}
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24 resize-none"
              rows={3}
              value={content1}
              onChange={handleContent1Change}
              disabled={loading}
            ></textarea>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Content 2</span>
              <span className="label-text-alt text-sm">
                {content2Count}/{MAX_CHARS}
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24 resize-none"
              rows={3}
              value={content2}
              onChange={handleContent2Change}
              disabled={loading}
            ></textarea>
          </div>
        </div>
        <div className="modal-action">
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {isOnline ? "Saving..." : "Saving offline..."}
              </>
            ) : (
              <>
                Save{!isOnline && " (offline)"}
              </>
            )}
          </button>
          <button 
            className="btn" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}