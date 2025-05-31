"use client";
import React, { createContext, useContext, useState } from 'react';

type PageType = 'notes' | 'settings' | 'profile' | 'notebooks';

interface NavigationContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  goToNotes: () => void;
  goToSettings: () => void;
  goToProfile: () => void;
  goToNotebooks: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('notes');

  const goToNotes = () => setCurrentPage('notes');
  const goToSettings = () => setCurrentPage('settings');
  const goToProfile = () => setCurrentPage('profile');
  const goToNotebooks = () => setCurrentPage('notebooks');

  return (
    <NavigationContext.Provider value={{ 
      currentPage, 
      setCurrentPage, 
      goToNotes, 
      goToSettings,
      goToProfile,
      goToNotebooks 
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