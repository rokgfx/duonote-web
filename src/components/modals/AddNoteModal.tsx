"use client";
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/lib/firebase";

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

  const MAX_CHARS = 150;

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
      // Save to Firebase
      await addDoc(collection(db, "notes"), {
        userId: user.uid,
        content1: content1.trim(),
        content2: content2.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Reset form and close modal
      setContent1("");
      setContent2("");
      setError("");
      onSave();
      onClose();
    } catch (err) {
      console.error("Error saving note:", err);
      setError("Failed to save note. Please try again.");
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
                Saving...
              </>
            ) : (
              "Save"
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