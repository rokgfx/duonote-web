export interface Notebook {
  id: string;
  name: string;
  description?: string;
  color?: string;
  languagePair?: string; // e.g., "English-Japanese", "English-Spanish"
  createdAt: Date | null; // Firebase Timestamp
  updatedAt: Date | null; // Firebase Timestamp
  userId: string;
}

export interface CreateNotebookData {
  name: string;
  description?: string;
  color?: string;
  languagePair?: string;
}