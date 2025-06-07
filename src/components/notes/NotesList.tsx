"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/lib/firebase";
import { PencilIcon } from "@heroicons/react/24/outline";
import AddNoteModal from "@/components/modals/AddNoteModal";
import { useSearch } from "@/hooks/useSearch";
import HighlightedText from "@/components/ui/HighlightedText";
import { useNotebooks } from "@/contexts/NotebookContext";
import { useNavigation } from "@/contexts/NavigationContext";
import FirstTimeWelcome from "@/components/ui/FirstTimeWelcome";

interface Note {
  id: string;
  content1: string;
  content2: string;
  createdAt: Date | null;
  userId: string;
  notebookId?: string;
}

const NOTES_PER_PAGE = 25;

interface NotesListProps {
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export default function NotesList({ searchQuery = "" }: NotesListProps = {}) {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [displayedNotes, setDisplayedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [flashingNotes, setFlashingNotes] = useState<Set<string>>(new Set());
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [user] = useAuthState(auth!);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { currentNotebook, notebooks } = useNotebooks();
  const { goToNotes } = useNavigation();

  // Use search hook
  const { searchResults, isSearching, setSearchQuery } = useSearch(allNotes);

  // Update search query when prop changes
  useEffect(() => {
    setSearchQuery(searchQuery);
  }, [searchQuery, setSearchQuery]);

  // Handle edit note
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingNote(null);
  };

  const handleSaveEdit = () => {
    // Modal will handle the actual save operation
    // This callback is for any additional actions after save
  };

  // Handle opening add note modal
  const handleOpenAddNoteModal = () => {
    setIsAddNoteModalOpen(true);
  };

  const handleCloseAddNoteModal = () => {
    setIsAddNoteModalOpen(false);
  };

  const handleSaveNote = () => {
    setIsAddNoteModalOpen(false);
    // Navigate back to notes after saving (useful when coming from welcome page)
    goToNotes();
  };

  // Handle copy content to clipboard
  const handleCopyContent = async (content: string, contentType: "content1" | "content2", noteId: string) => {
    try {
      // Add flash effect
      const flashKey = `${noteId}-${contentType}`;
      setFlashingNotes(prev => new Set(prev).add(flashKey));
      
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
        //console.log(`${contentType} copied to clipboard: ${content}`);
      } else {
        // Fallback for mobile/older browsers
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          //console.log(`${contentType} copied to clipboard: ${content}`);
        } else {
          throw new Error('Copy command was unsuccessful');
        }
      }
      
      // Remove flash effect after animation
      setTimeout(() => {
        setFlashingNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(flashKey);
          return newSet;
        });
      }, 200); // Match the animation duration
      
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Remove flash effect on error too
      const flashKey = `${noteId}-${contentType}`;
      setFlashingNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(flashKey);
        return newSet;
      });
    }
  };

  // Get the notes to display (search results or regular notes)
  const notesToDisplay = isSearching ? searchResults : displayedNotes;

  // Load more notes from the cached data (only for non-search mode)
  const loadMoreNotes = useCallback(() => {
    console.log("loadMoreNotes called");

    if (!hasMore || loadingMore || isSearching) {
      console.log("Not loading more:", { hasMore, loadingMore, isSearching });
      return;
    }

    setLoadingMore(true);
    
    const nextPage = currentPage + 1;
    const startIndex = nextPage * NOTES_PER_PAGE;
    const endIndex = startIndex + NOTES_PER_PAGE;
    
    const newNotes = allNotes.slice(startIndex, endIndex);

    console.log("Trying to load notes from", startIndex, "to", endIndex, "-> Found:", newNotes.length);
    
     if (newNotes.length === 0) {
      setHasMore(false);
      setLoadingMore(false);
      return;
    }

    // Only add *new* notes
    setDisplayedNotes(prev => {
      const prevIds = new Set(prev.map(n => n.id));
      const uniqueNewNotes = newNotes.filter(n => !prevIds.has(n.id));
      return [...prev, ...uniqueNewNotes];
    });
    setCurrentPage(nextPage);

    // After appending, if we've displayed all notes, stop infinite scroll
    if (endIndex >= allNotes.length) {
      setHasMore(false);
    }
    
    setLoadingMore(false);
  }, [allNotes, currentPage, hasMore, loadingMore, isSearching]);

  // Refs for intersection observer to avoid recreating it
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const loadMoreNotesRef = useRef(loadMoreNotes);

  // Keep refs updated
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    loadMoreNotesRef.current = loadMoreNotes;
  }, [loadMoreNotes]);

  // Set up intersection observer for infinite scroll (only for non-search mode)
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    if (isSearching) return;

    if (!loadMoreRef.current) {
      console.log("No loadMoreRef.current to observe");
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        console.log("Observer callback fired", entries);
        if (entries[0].isIntersecting) {
          console.log("LoadMore div is visible!");
          if (hasMoreRef.current && !loadingMoreRef.current) {
            loadMoreNotesRef.current();
          }
        }
      },
      {
        threshold: 0.1,
        root: null,
        rootMargin: '100px'
      }
    );

    observerRef.current.observe(loadMoreRef.current);
    console.log("Observer now watching", loadMoreRef.current);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isSearching, hasMore, displayedNotes.length]);


  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    try {
      // Create query to get user's notes filtered by current notebook
      const queryConstraints = [
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      ];

      // Add notebook filter if a notebook is selected
      if (currentNotebook?.id) {
        queryConstraints.splice(1, 0, where("notebookId", "==", currentNotebook.id));
      }

      const notesQuery = query(
        collection(db, "notes"),
        ...queryConstraints
      );

      // Listen for real-time updates - this gets ALL notes
      const unsubscribe = onSnapshot(
        notesQuery,
        (snapshot) => {
          const notesData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || null
            };
          }) as Note[];
          
          // Store all notes
          setAllNotes(notesData);
          
          // Reset pagination and show first page
          const firstPageNotes = notesData.slice(0, NOTES_PER_PAGE);
          setDisplayedNotes(firstPageNotes);
          setCurrentPage(0);
          setHasMore(notesData.length > NOTES_PER_PAGE);
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
  }, [user, currentNotebook]);

  // Render main content based on state
  const renderMainContent = () => {
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

    if (allNotes.length === 0 && !loading) {
      return (
        <FirstTimeWelcome 
          hasNotebooks={notebooks.length > 0}
          onCreateFirstNote={handleOpenAddNoteModal}
        />
      );
    }

    // Show "no search results" message when searching but no results
    if (isSearching && searchResults.length === 0 && allNotes.length > 0) {
      return (
        <div className="text-center py-12">
          <p className="text-base-content/60 text-lg">No notes found</p>
          <p className="text-base-content/40 text-sm mt-2">
            Try adjusting your search query
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 pb-4">
        {notesToDisplay.map((note) => (
          <div key={note.id} className="card bg-base-100 rounded-xl shadow-md relative">
            {/* Edit button */}
            <button
              onClick={() => handleEditNote(note)}
              className="btn btn-ghost btn-sm btn-circle absolute top-2 right-2 opacity-60 hover:opacity-100"
              title="Edit note"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            
            <div className="card-body p-4">
              {/* Content 1 - Top half */}
              <div 
                className={`cursor-pointer rounded-md p-2 transition-all duration-100 ${
                  flashingNotes.has(`${note.id}-content1`) ? 'bg-base-200 animate-pulse' : ''
                }`}
                onClick={() => handleCopyContent(note.content1, "content1", note.id)}
                title="Click to copy content 1"
              >
                <div className="text-base leading-relaxed pr-8">
                  {isSearching ? (
                    <HighlightedText text={note.content1} searchQuery={searchQuery} />
                  ) : (
                    note.content1
                  )}
                </div>
              </div>

              <div className="my-2 border-b border-base-content/10"/>
              
              {/* Content 2 - Bottom half */}
              <div 
                className={`cursor-pointer rounded-md p-2 transition-all duration-100 ${
                  flashingNotes.has(`${note.id}-content2`) ? 'bg-base-200 animate-pulse' : ''
                }`}
                onClick={() => handleCopyContent(note.content2, "content2", note.id)}
                title="Click to copy content 2"
              >
                <div className="text-base leading-relaxed pr-8">
                  {isSearching ? (
                    <HighlightedText text={note.content2} searchQuery={searchQuery} />
                  ) : (
                    note.content2
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      
      {/* Infinite scroll trigger - only show when not searching */}
      {!isSearching && hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8 min-h-[1px]">
          {loadingMore ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : (
            <div className="text-base-content/40 text-sm">
              Scroll down to load more notes...
            </div>
          )}
        </div>
      )}
      
      {/* End of list indicator - only show when not searching */}
      {!isSearching && !hasMore && displayedNotes.length > 0 && (
        <div className="text-center py-8">
          {/* <p className="text-base-content/40 text-sm">
            You&apos;ve reached the end of your notes
          </p> */}
        </div>
        )}
        </div>
      );
    };
  
    return (
      <>
        {/* Main content */}
        {renderMainContent()}

        {/* Edit Note Modal */}
        <AddNoteModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          editNote={editingNote}
        />

        {/* Add Note Modal */}
        <AddNoteModal
          isOpen={isAddNoteModalOpen}
          onClose={handleCloseAddNoteModal}
          onSave={handleSaveNote}
        />
      </>
    );
  }