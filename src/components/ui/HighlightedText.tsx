"use client";
import React from "react";

interface HighlightedTextProps {
  text: string;
  searchQuery: string;
}

export default function HighlightedText({ text, searchQuery }: HighlightedTextProps) {
  if (!searchQuery || searchQuery.trim() === '') {
    return <>{text}</>;
  }

  try {
    // Escape special regex characters in the search query
    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create a regex that matches the search terms (case insensitive)
    // Split by spaces to highlight individual words
    const searchTerms = escapedQuery.trim().split(/\s+/).filter(term => term.length > 0);
    const regexPattern = searchTerms.join('|');
    
    if (!regexPattern) {
      return <>{text}</>;
    }
    
    const regex = new RegExp(`(${regexPattern})`, 'gi');
    
    // Split the text by matches
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, index) => {
          // Check if this part matches any search term
          const isMatch = searchTerms.some(term => 
            part.toLowerCase() === term.toLowerCase()
          );
          
          if (isMatch) {
            return (
              <strong key={index} className="font-bold">
                {part}
              </strong>
            );
          }
          
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  } catch (error) {
    console.error('Error highlighting text:', error);
    return <>{text}</>;
  }
}