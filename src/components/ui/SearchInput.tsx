"use client";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchContext } from "@/contexts/SearchContext";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ 
  placeholder = "Search notes...", 
  className = "" 
}: SearchInputProps) {
  const { searchQuery, setSearchQuery } = useSearchContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        className="input input-bordered w-full pl-10"
      />
      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}