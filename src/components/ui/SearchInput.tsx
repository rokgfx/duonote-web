"use client";
import React, { useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchContext } from "@/contexts/SearchContext";
import { useNavigation } from "@/contexts/NavigationContext";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ 
  placeholder = "Search notes...", 
  className = "" 
}: SearchInputProps) {
  const { searchQuery, setSearchQuery } = useSearchContext();
  const { currentPage, goToNotes } = useNavigation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // If user starts typing and we're not on the notes page, switch to notes page
    if (newValue.length > 0 && currentPage !== 'notes') {
      goToNotes();
    }
    
    setSearchQuery(newValue);
  };

  // Auto-focus on desktop only
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768; // md breakpoint
    if (isDesktop && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        className="input w-full pl-10 rounded-lg bg-zinc-100 border-none"
      />
      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}