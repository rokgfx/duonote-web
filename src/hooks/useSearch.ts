"use client";
import { useState, useEffect, useMemo } from 'react';
import FlexSearch from 'flexsearch';

interface Note {
  id: string;
  content1: string;
  content2: string;
  createdAt: any;
  userId: string;
}

interface SearchResult {
  note: Note;
  score: number;
}

export function useSearch(notes: Note[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Note[]>([]);

  // Create FlexSearch index
  const searchIndex = useMemo(() => {
    const index = new FlexSearch.Index({
      // Enable fuzzy search with typo tolerance
      preset: 'match',
      tokenize: 'reverse',
      resolution: 9,
      // Better Unicode support for multiple languages
      encode: (str: string) => {
        // Normalize Unicode for better matching across different input methods
        str = str.normalize('NFKC').toLowerCase();
        
        // Split by Unicode word boundaries and character types
        // This handles CJK (no spaces), Arabic, Hebrew, etc.
        const tokens: string[] = [];
        
        // Check if Intl.Segmenter is available (newer browsers)
        if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
          try {
            const segmenter = new (Intl as any).Segmenter(undefined, { granularity: 'word' });
            const segments = segmenter.segment(str);
            
            for (const segment of segments) {
              if (segment.isWordLike) {
                tokens.push(segment.segment);
                
                // For CJK characters, also add individual characters as tokens
                const segmentText = segment.segment as string;
                if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(segmentText)) {
                  tokens.push(...Array.from(segmentText));
                }
              }
            }
          } catch (e) {
            // Fallback to simple tokenization
            return str.split(/\s+/).filter(token => token.length > 0);
          }
        } else {
          // Fallback for older browsers - enhanced tokenization
          // Split on spaces and common punctuation
          const basicTokens = str.split(/[\s\u3000,，.。!！?？;；:：、·]+/).filter(t => t.length > 0);
          
          for (const token of basicTokens) {
            tokens.push(token);
            
            // For strings containing CJK characters, also split into individual characters
            if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(token)) {
              // Add individual CJK characters as separate tokens
              tokens.push(...Array.from(token));
            }
          }
        }
        
        return tokens;
      }
    });

    return index;
  }, []);

  // Index notes when they change
  useEffect(() => {
    if (notes.length === 0) return;

    // Clear existing index
    searchIndex.clear();

    // Index each note with combined content
    notes.forEach((note) => {
      const combinedContent = `${note.content1} ${note.content2}`.toLowerCase();
      searchIndex.add(note.id, combinedContent);
    });
  }, [notes, searchIndex]);

  // Perform search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Search for results
      const results = searchIndex.search(searchQuery.toLowerCase(), {
        limit: 50, // Limit results for performance
        suggest: true, // Enable suggestions for typos
      });

      // Convert results to notes with scoring
      const searchResultNotes: SearchResult[] = [];
      
      results.forEach((resultId) => {
        const note = notes.find(n => n.id === resultId);
        if (note) {
          // Calculate relevance score based on exact matches and position
          let score = 0;
          const query = searchQuery.toLowerCase();
          const content1Lower = note.content1.toLowerCase();
          const content2Lower = note.content2.toLowerCase();
          
          // Exact phrase match gets highest score
          if (content1Lower.includes(query) || content2Lower.includes(query)) {
            score += 100;
            
            // Bonus for start-of-string matches
            if (content1Lower.startsWith(query) || content2Lower.startsWith(query)) {
              score += 50;
            }
          }
          
          // Word boundary matches get good score
          const queryWords = query.split(/\s+/);
          queryWords.forEach(word => {
            if (word.length > 1) {
              // Escape special regex characters
              const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const wordRegex = new RegExp(`\\b${escapedWord}`, 'i');
              if (wordRegex.test(note.content1) || wordRegex.test(note.content2)) {
                score += 25;
              }
            }
          });
          
          // Base score for any match (fuzzy)
          score += 10;
          
          searchResultNotes.push({ note, score });
        }
      });

      // Sort by score (highest first) and extract notes
      const sortedNotes = searchResultNotes
        .sort((a, b) => b.score - a.score)
        .map(result => result.note);

      setSearchResults(sortedNotes);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  }, [searchQuery, notes, searchIndex]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching: searchQuery.trim().length > 0,
  };
}