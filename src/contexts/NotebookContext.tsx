"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/lib/firebase';
import { Notebook, CreateNotebookData } from '@/types/notebook';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface NotebookContextType {
  notebooks: Notebook[];
  currentNotebook: Notebook | null;
  setCurrentNotebook: (notebook: Notebook | null) => void;
  createNotebook: (data: CreateNotebookData) => Promise<void>;
  updateNotebook: (id: string, data: Partial<CreateNotebookData>) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;
  loading: boolean;
  error: string;
}

const NotebookContext = createContext<NotebookContextType | undefined>(undefined);

export function NotebookProvider({ children }: { children: React.ReactNode }) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [currentNotebook, setCurrentNotebook] = useState<Notebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user] = useAuthState(auth!);
  const isOnline = useNetworkStatus();

  // Key for localStorage
  const getLastNotebookKey = () => user ? `lastNotebook_${user.uid}` : null;

  // Save current notebook to localStorage
  const saveLastNotebook = (notebook: Notebook | null) => {
    const key = getLastNotebookKey();
    if (key) {
      if (notebook) {
        localStorage.setItem(key, notebook.id);
      } else {
        localStorage.removeItem(key);
      }
    }
  };

  // Get last notebook from localStorage
  const getLastNotebook = (): string | null => {
    const key = getLastNotebookKey();
    return key ? localStorage.getItem(key) : null;
  };

  // Load notebooks when user is available
  useEffect(() => {
  if (!user || !db) {
    setLoading(false);
    return;
  }

  try {
    const notebooksQuery = query(
      collection(db, 'notebooks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      notebooksQuery,
      (snapshot) => {
        const notebooksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notebook[];

        setNotebooks(notebooksData);

        // Only update currentNotebook if it's missing/changed
        setCurrentNotebook(prevNotebook => {
          // If none selected, try to restore from localStorage, then pick the first
          if (!prevNotebook && notebooksData.length > 0) {
            const lastNotebookId = getLastNotebook();
            const lastNotebook = lastNotebookId ? notebooksData.find(nb => nb.id === lastNotebookId) : null;
            return lastNotebook || notebooksData[0];
          }
          // If prevNotebook was deleted, select another
          if (
            prevNotebook &&
            !notebooksData.find(nb => nb.id === prevNotebook.id)
          ) {
            return notebooksData[0] || null;
          }
          // Else, keep the current notebook
          return prevNotebook || null;
        });

        setLoading(false);
      },
      (err) => {
        console.error('Error fetching notebooks:', err);
        setError('Failed to load notebooks');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  } catch (err) {
    console.error('Error setting up notebooks listener:', err);
    setError('Failed to load notebooks');
    setLoading(false);
  }
}, [user]);

  // Save current notebook to localStorage whenever it changes
  useEffect(() => {
    if (user && currentNotebook) {
      saveLastNotebook(currentNotebook);
    }
  }, [currentNotebook, user]);
  

  const createNotebook = async (data: CreateNotebookData) => {
    if (!user || !db) {
      throw new Error('User not authenticated or database not available');
    }

    setError('');

    try {
      const timestamp = isOnline ? serverTimestamp() : Timestamp.now();
      const notebookData = {
        ...data,
        userId: user.uid,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      if (!isOnline) {
        // Offline mode with timeout
        const addPromise = addDoc(collection(db, 'notebooks'), notebookData);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Offline create timeout')), 2000);
        });
        
        try {
          await Promise.race([addPromise, timeoutPromise]);
        } catch (timeoutError) {
          console.log('Create operation timed out (expected in offline mode) - data cached locally');
        }
      } else {
        await addDoc(collection(db, 'notebooks'), notebookData);
      }

      console.log(isOnline ? 'Notebook created' : 'Notebook created locally - will sync when online');
    } catch (err) {
      console.error('Error creating notebook:', err);
      setError(`Failed to create notebook${!isOnline ? ' (offline)' : ''}. Please try again.`);
      throw err;
    }
  };

  const updateNotebook = async (id: string, data: Partial<CreateNotebookData>) => {
    if (!user || !db) {
      throw new Error('User not authenticated or database not available');
    }

    setError('');

    try {
      const timestamp = isOnline ? serverTimestamp() : Timestamp.now();
      const updateData = {
        ...data,
        updatedAt: timestamp,
      };

      const notebookRef = doc(db, 'notebooks', id);

      if (!isOnline) {
        // Offline mode with timeout
        const updatePromise = updateDoc(notebookRef, updateData);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Offline update timeout')), 2000);
        });
        
        try {
          await Promise.race([updatePromise, timeoutPromise]);
        } catch (timeoutError) {
          console.log('Update operation timed out (expected in offline mode) - data cached locally');
        }
      } else {
        await updateDoc(notebookRef, updateData);
      }

      console.log(isOnline ? 'Notebook updated' : 'Notebook updated locally - will sync when online');
    } catch (err) {
      console.error('Error updating notebook:', err);
      setError(`Failed to update notebook${!isOnline ? ' (offline)' : ''}. Please try again.`);
      throw err;
    }
  };

  const deleteNotebook = async (id: string) => {
    if (!user || !db) {
      throw new Error('User not authenticated or database not available');
    }

    // Prevent deleting the last notebook
    if (notebooks.length <= 1) {
      throw new Error('Cannot delete the last notebook');
    }

    setError('');

    try {
      const notebookRef = doc(db, 'notebooks', id);

      if (!isOnline) {
        // Offline mode with timeout
        const deletePromise = deleteDoc(notebookRef);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Offline delete timeout')), 2000);
        });
        
        try {
          await Promise.race([deletePromise, timeoutPromise]);
        } catch (timeoutError) {
          console.log('Delete operation timed out (expected in offline mode) - data cached locally');
        }
      } else {
        await deleteDoc(notebookRef);
      }

      // If we're deleting the current notebook, switch to another one
      if (currentNotebook?.id === id) {
        const remainingNotebooks = notebooks.filter(nb => nb.id !== id);
        if (remainingNotebooks.length > 0) {
          setCurrentNotebook(remainingNotebooks[0]);
        }
      }

      console.log(isOnline ? 'Notebook deleted' : 'Notebook deleted locally - will sync when online');
    } catch (err) {
      console.error('Error deleting notebook:', err);
      setError(`Failed to delete notebook${!isOnline ? ' (offline)' : ''}. Please try again.`);
      throw err;
    }
  };

  return (
    <NotebookContext.Provider value={{
      notebooks,
      currentNotebook,
      setCurrentNotebook,
      createNotebook,
      updateNotebook,
      deleteNotebook,
      loading,
      error
    }}>
      {children}
    </NotebookContext.Provider>
  );
}

export function useNotebooks() {
  const context = useContext(NotebookContext);
  if (context === undefined) {
    throw new Error('useNotebooks must be used within a NotebookProvider');
  }
  return context;
}