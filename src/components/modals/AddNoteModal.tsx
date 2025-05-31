"use client";
import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { collection, addDoc, serverTimestamp, Timestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/lib/firebase";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useNotebooks } from "@/contexts/NotebookContext";

interface Note {
  id: string;
  content1: string;
  content2: string;
  createdAt: any;
  userId: string;
  notebookId?: string;
}

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editNote?: Note | null; // Optional note to edit
}

export default function AddNoteModal({ isOpen, onClose, onSave, editNote }: AddNoteModalProps) {
  const [content1, setContent1] = useState("");
  const [content2, setContent2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth!);
  const isOnline = useNetworkStatus();
  const { currentNotebook, notebooks } = useNotebooks();

  const MAX_CHARS = 200;
  const isEditing = !!editNote;

  // Predefined colors array (same as NotebookPage)
  const predefinedColors = [
    '#E74C3C', // red
    '#F39C12', // orange  
    '#F7DC6F', // yellow
    '#58D68D', // green
    '#AFEEEE', // cyan
    '#1E90FF', // blue
    '#9370DB', // violet
    '#FFC0CB', // pink
    '#F8F8FF', // white
    '#4d5052', // black
  ];

  // Reset form when modal is closed or populate when editing
  useEffect(() => {
    if (!isOpen) {
      setContent1("");
      setContent2("");
      setError("");
      setLoading(false);
    } else if (editNote) {
      // Populate form with existing note data when editing
      setContent1(editNote.content1);
      setContent2(editNote.content2);
      setError("");
      setLoading(false);
    } else {
      // Clear form for new note
      setContent1("");
      setContent2("");
      setError("");
      setLoading(false);
    }
  }, [isOpen, editNote]);

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

  // Parse language pair to get individual languages
  const getLanguageLabels = () => {
    if (currentNotebook?.languagePair) {
      const languages = currentNotebook.languagePair.split(' ↔ ');
      return {
        language1: languages[0] || 'Content 1',
        language2: languages[1] || 'Content 2'
      };
    }
    return {
      language1: 'Content 1',
      language2: 'Content 2'
    };
  };

  const { language1, language2 } = getLanguageLabels();

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

    if (!isEditing && !currentNotebook) {
      setError("Please create a notebook first before adding notes.");
      return;
    }

    setLoading(true);

    try {
      const timestamp = isOnline ? serverTimestamp() : Timestamp.now();

      if (isEditing && editNote) {
        // Update existing note
        const noteRef = doc(db, "notes", editNote.id);
        const updateData = {
          content1: content1.trim(),
          content2: content2.trim(),
          updatedAt: timestamp,
        };

        if (!isOnline) {
          // In offline mode, update with timeout to avoid hanging
          const updatePromise = updateDoc(noteRef, updateData);
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Offline update timeout")), 2000);
          });
          
          try {
            await Promise.race([updatePromise, timeoutPromise]);
          } catch (timeoutError) {
            console.log("Update operation timed out (expected in offline mode) - data cached locally");
          }
        } else {
          await updateDoc(noteRef, updateData);
        }

        console.log(isOnline ? "Note updated" : "Note updated locally - will sync when online");
      } else {
        // Create new note
        const noteData = {
          userId: user.uid,
          content1: content1.trim(),
          content2: content2.trim(),
          notebookId: currentNotebook?.id || null,
          createdAt: timestamp,
          updatedAt: timestamp,
          createdOffline: !isOnline,
        };

        if (!isOnline) {
          // In offline mode, add with timeout to avoid hanging
          const addDocPromise = addDoc(collection(db, "notes"), noteData);
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Offline save timeout")), 2000);
          });
          
          try {
            await Promise.race([addDocPromise, timeoutPromise]);
          } catch (timeoutError) {
            console.log("Save operation timed out (expected in offline mode) - data cached locally");
          }
        } else {
          await addDoc(collection(db, "notes"), noteData);
        }

        console.log(isOnline ? "Note created" : "Note created locally - will sync when online");
      }

      // Reset form and close modal
      setContent1("");
      setContent2("");
      setError("");
      onSave();
      onClose();
      
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'saving'} note:`, err);
      setError(`Failed to ${isEditing ? 'update' : 'save'} note${!isOnline ? ' (offline)' : ''}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editNote || !db) return;

    setLoading(true);
    setError("");

    try {
      const noteRef = doc(db, "notes", editNote.id);

      if (!isOnline) {
        // In offline mode, delete with timeout to avoid hanging
        const deletePromise = deleteDoc(noteRef);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Offline delete timeout")), 2000);
        });
        
        try {
          await Promise.race([deletePromise, timeoutPromise]);
        } catch (timeoutError) {
          console.log("Delete operation timed out (expected in offline mode) - data cached locally");
        }
      } else {
        await deleteDoc(noteRef);
      }

      console.log(isOnline ? "Note deleted" : "Note deleted locally - will sync when online");
      
      // Close modal after successful delete
      onSave(); // Trigger any refresh logic
      onClose();
      
    } catch (err) {
      console.error("Error deleting note:", err);
      setError(`Failed to delete note${!isOnline ? ' (offline)' : ''}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{isEditing ? 'Edit Note' : 'Add New Note'}</h3>
        
        {/* Show current notebook info when creating new notes */}
        {!isEditing && currentNotebook && (
          <div className="mb-2 mt-4">
            <div className="flex items-center gap-3 p-0">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: currentNotebook.color || predefinedColors[0] }}
              ></div>
              <div className="flex-1">
                <div className="font-medium">{currentNotebook.name}</div>
                {currentNotebook.languagePair && (
                  <div className="text-sm text-base-content/60">{currentNotebook.languagePair}</div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="py-4 space-y-4">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}
          <div>
            <label className="label">
              <span className="label-text">{language1}</span>
            </label>
            <textarea
              className="textarea bg-zinc-100 border-solid border-zinc-300 rounded-lg w-full h-24 resize-none"
              rows={3}
              value={content1}
              onChange={handleContent1Change}
              disabled={loading}
            ></textarea>
            <div className="text-xs text-base-content/60 text-right mt-1">
              {content1Count}/{MAX_CHARS}
            </div>
          </div>
          <div>
            <label className="label">
              <span className="label-text">{language2}</span>
            </label>
            <textarea
              className="textarea bg-zinc-100 border-solid border-zinc-300 rounded-lg w-full h-24 resize-none"
              rows={3}
              value={content2}
              onChange={handleContent2Change}
              disabled={loading}
            ></textarea>
            <div className="text-xs text-base-content/60 text-right mt-1">
              {content2Count}/{MAX_CHARS}
            </div>
          </div>
        </div>
        <div className="modal-action">
          {/* Delete button - only show when editing */}
          {isEditing && (
            <button 
              className="btn btn-error mr-auto px-8 rounded-full" 
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {isOnline ? "Deleting..." : "Deleting offline..."}
                </>
              ) : (
                <>
                  <TrashIcon className="h-4 w-4" />
                  Delete{!isOnline && " (offline)"}
                </>
              )}
            </button>
          )}
          
          {/* Cancel button */}
          <button 
            className="btn px-8 rounded-full btn-ghost" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          {/* Update/Save button */}
          <button 
            className="btn btn-primary px-8 rounded-full" 
            onClick={handleSave}
            disabled={loading || !content1.trim() || !content2.trim()}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {isEditing 
                  ? (isOnline ? "Updating..." : "Updating offline...") 
                  : (isOnline ? "Saving..." : "Saving offline...")
                }
              </>
            ) : (
              <>
                {isEditing ? "Update" : "Save"}{!isOnline && " (offline)"}
              </>
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}