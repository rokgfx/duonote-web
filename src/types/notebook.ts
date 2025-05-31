export interface Notebook {
  id: string;
  name: string;
  description?: string;
  color?: string;
  languagePair?: string; // e.g., "English-Japanese", "English-Spanish"
  createdAt: any; // Firebase Timestamp
  updatedAt: any; // Firebase Timestamp
  userId: string;
  isDefault?: boolean;
}

export interface CreateNotebookData {
  name: string;
  description?: string;
  color?: string;
  languagePair?: string;
}