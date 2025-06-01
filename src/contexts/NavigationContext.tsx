"use client";
import React, { createContext, useContext, useState } from 'react';

type PageType = 'notes' | 'settings' | 'notebooks';

interface NavigationContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  goToNotes: () => void;
  goToSettings: () => void;
  goToNotebooks: () => void;
  goToNotebooksWithCreate: () => void;
  shouldShowCreateForm: boolean;
  clearCreateForm: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('notes');
  const [shouldShowCreateForm, setShouldShowCreateForm] = useState(false);

  const goToNotes = () => {
    setCurrentPage('notes');
    setShouldShowCreateForm(false);
  };
  
  const goToSettings = () => {
    setCurrentPage('settings');
    setShouldShowCreateForm(false);
  };
  
  const goToNotebooks = () => {
    setCurrentPage('notebooks');
    setShouldShowCreateForm(false);
  };
  
  const goToNotebooksWithCreate = () => {
    setCurrentPage('notebooks');
    setShouldShowCreateForm(true);
  };
  
  const clearCreateForm = () => {
    setShouldShowCreateForm(false);
  };

  return (
    <NavigationContext.Provider value={{ 
      currentPage, 
      setCurrentPage, 
      goToNotes, 
      goToSettings,
      goToNotebooks,
      goToNotebooksWithCreate,
      shouldShowCreateForm,
      clearCreateForm
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}