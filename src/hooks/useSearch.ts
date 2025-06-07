"use client";
import { useState, useEffect, useMemo } from 'react';
import FlexSearch from 'flexsearch';

interface Note {
  id: string;
  content1: string;
  content2: string;
  createdAt: Date | null;
  userId: string;
  notebookId?: string;
}

interface SearchResult {
  note: Note;
  score: number;
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Check if query is a subsequence (allows skipping characters)
// Returns a score based on how dense the match is
function subsequenceScore(query: string, text: string): number {
  let qIndex = 0;
  const qLen = query.length;
  const matches: number[] = [];
  
  for (let i = 0; i < text.length && qIndex < qLen; i++) {
    if (text[i] === query[qIndex]) {
      matches.push(i);
      qIndex++;
    }
  }
  
  if (qIndex !== qLen) {
    return 0; // Not a subsequence
  }
  
  // Calculate density score based on how spread out the matches are
  const firstMatch = matches[0];
  const lastMatch = matches[matches.length - 1];
  const matchSpan = lastMatch - firstMatch + 1;
  const density = qLen / matchSpan;
  
  // If matches are too spread out (density < 0.3), consider it a poor match
  if (density < 0.3) {
    return 0;
  }
  
  // Return a score between 0-100 based on density
  return density * 100;
}

// Calculate fuzzy match score
function calculateFuzzyScore(query: string, text: string): number {
  const normalizedQuery = query.toLowerCase();
  const normalizedText = text.toLowerCase();
  
  // Exact match
  if (normalizedText.includes(normalizedQuery)) {
    return 100;
  }
  
  // Check each word for fuzzy matches
  const words = normalizedText.split(/\s+/);
  let bestScore = 0;
  
  for (const word of words) {
    // Subsequence match within a word with density check
    const subScore = subsequenceScore(normalizedQuery, word);
    if (subScore > 0) {
      // Scale subsequence score to 50-80 range based on density
      bestScore = Math.max(bestScore, 50 + (subScore * 0.3));
    }
    
    // Calculate Levenshtein distance for typo tolerance
    const distance = levenshteinDistance(normalizedQuery, word);
    const maxLen = Math.max(normalizedQuery.length, word.length);
    const similarity = 1 - (distance / maxLen);
    
    // If similarity is above threshold, calculate score
    if (similarity > 0.6) {
      const score = similarity * 60;
      bestScore = Math.max(bestScore, score);
    }
    
    // Check if query matches beginning of word
    if (word.startsWith(normalizedQuery)) {
      bestScore = Math.max(bestScore, 65);
    }
    
    // Check substrings of the word
    for (let i = 0; i <= word.length - normalizedQuery.length; i++) {
      const substring = word.substring(i, i + normalizedQuery.length);
      const subDistance = levenshteinDistance(normalizedQuery, substring);
      if (subDistance <= 1) { // Allow 1 typo
        bestScore = Math.max(bestScore, 50 - subDistance * 10);
      }
    }
  }
  
  // Only check full text subsequence if we haven't found good word matches
  if (bestScore < 30) {
    const fullTextSubScore = subsequenceScore(normalizedQuery, normalizedText);
    if (fullTextSubScore > 70) { // Only accept very dense matches across full text
      bestScore = Math.max(bestScore, fullTextSubScore * 0.4); // Lower weight for full text matches
    }
  }
  
  return bestScore;
}

export function useSearch(notes: Note[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Note[]>([]);

  // Create FlexSearch index with enhanced configuration
  const searchIndex = useMemo(() => {
    const index = new FlexSearch.Index({
      // Use 'full' preset for better substring matching
      preset: 'performance',
      // Use forward tokenization for better partial matches
      tokenize: 'forward',
      // Higher resolution for better accuracy
      resolution: 9,
      // Removed depth as it's not valid for IndexOptions
      // Better Unicode support for multiple languages
      encode: (str: string) => {
        // Normalize Unicode for better matching across different input methods
        str = str.normalize('NFKC').toLowerCase();
        
        // Split by Unicode word boundaries and character types
        const tokens: string[] = [];
        
        // Check if Intl.Segmenter is available (newer browsers)
        if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
          try {
            const segmenter = new (Intl as { Segmenter: new (locale?: string, options?: { granularity: string }) => { segment: (str: string) => Iterable<{ segment: string; isWordLike: boolean }> } }).Segmenter(undefined, { granularity: 'word' });
            const segments = segmenter.segment(str);
            
            for (const segment of segments) {
              if (segment.isWordLike) {
                const word = segment.segment;
                tokens.push(word);
                
                // Add n-grams for better partial matching
                if (word.length > 3) {
                  for (let i = 0; i < word.length - 2; i++) {
                    tokens.push(word.substring(i, i + 3));
                  }
                }
                
                // For CJK characters, also add individual characters as tokens
                if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(word)) {
                  tokens.push(...Array.from(word));
                }
              }
            }
          } catch {
            // Fallback to enhanced tokenization
            const words = str.split(/[\s\u3000,，.。!！?？;；:：、·]+/).filter(t => t.length > 0);
            
            for (const word of words) {
              tokens.push(word);
              
              // Add n-grams for partial matching
              if (word.length > 3) {
                for (let i = 0; i < word.length - 2; i++) {
                  tokens.push(word.substring(i, i + 3));
                }
              }
              
              // For CJK characters, split into individual characters
              if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(word)) {
                tokens.push(...Array.from(word));
              }
            }
          }
        } else {
          // Fallback for older browsers
          const words = str.split(/[\s\u3000,，.。!！?？;；:：、·]+/).filter(t => t.length > 0);
          
          for (const word of words) {
            tokens.push(word);
            
            // Add n-grams for partial matching
            if (word.length > 3) {
              for (let i = 0; i < word.length - 2; i++) {
                tokens.push(word.substring(i, i + 3));
              }
            }
            
            // For CJK characters
            if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(word)) {
              tokens.push(...Array.from(word));
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
      // First, get results from FlexSearch
      const flexSearchResults = searchIndex.search(searchQuery.toLowerCase(), {
        limit: 100, // Increased limit to catch more potential matches
        suggest: true, // Enable suggestions for typos
      });

      // Convert to Set for faster lookup
      const flexSearchIds = new Set(flexSearchResults);
      
      // Calculate scores for all notes
      const searchResultNotes: SearchResult[] = [];
      
      notes.forEach((note) => {
        const combinedContent = `${note.content1} ${note.content2}`;
        const content1Score = calculateFuzzyScore(searchQuery, note.content1);
        const content2Score = calculateFuzzyScore(searchQuery, note.content2);
        const combinedScore = calculateFuzzyScore(searchQuery, combinedContent);
        
        // Get the best score from all content
        let score = Math.max(content1Score, content2Score, combinedScore);
        
        // Boost score if also found by FlexSearch
        if (flexSearchIds.has(note.id)) {
          score += 20;
        }
        
        // Only include results with a minimum score threshold
        if (score >= 30) {
          searchResultNotes.push({ note, score });
        }
      });

      // Sort by score (highest first) and extract notes
      const sortedNotes = searchResultNotes
        .sort((a, b) => b.score - a.score)
        .slice(0, 50) // Limit final results
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