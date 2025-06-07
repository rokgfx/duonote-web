"use client";
import React, { useState } from "react";
import { useNotebooks } from "@/contexts/NotebookContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/lib/firebase";

interface Note {
  id: string;
  content1: string;
  content2: string;
  createdAt: any;
  userId: string;
  notebookId?: string;
}

interface SettingsPageProps {
  onBackToNotes: () => void;
}

export default function SettingsPage({ onBackToNotes }: SettingsPageProps) {
  const { notebooks } = useNotebooks();
  const [user] = useAuthState(auth!);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedNotebookForExport, setSelectedNotebookForExport] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // TODO: Implement save settings functionality
    console.log("Save settings clicked");
    
    // Add 300ms delay for better UX
    setTimeout(() => {
      setIsSaving(false);
      onBackToNotes();
    }, 800);
  };


  const fetchNotesFromNotebook = async (notebookId: string) => {
    if (!user || !db) return [];
    
    try {
      const notesQuery = query(
        collection(db, "notes"),
        where("userId", "==", user.uid),
        where("notebookId", "==", notebookId)
      );
      
      const querySnapshot = await getDocs(notesQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  };

  const exportToCSV = async () => {
    if (!selectedNotebookForExport) return;
    
    setIsExporting(true);
    
    try {
      const notes = await fetchNotesFromNotebook(selectedNotebookForExport);
      const selectedNotebook = notebooks.find(nb => nb.id === selectedNotebookForExport);
      
      if (notes.length === 0) {
        alert('No notes found in this notebook.');
        setIsExporting(false);
        return;
      }
      
      // Create CSV content
      const headers = ['Content 1', 'Content 2'];
      const csvContent = [
        headers.join(','),
        ...notes.map(note => [
          `"${(note.content1 || '').replace(/"/g, '""')}"`,
          `"${(note.content2 || '').replace(/"/g, '""')}"`
        ].join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedNotebook?.name || 'notebook'}-notes.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export notes. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    if (!selectedNotebookForExport) return;
    
    setIsExporting(true);
    
    try {
      const notes = await fetchNotesFromNotebook(selectedNotebookForExport);
      const selectedNotebook = notebooks.find(nb => nb.id === selectedNotebookForExport);
      
      if (notes.length === 0) {
        alert('No notes found in this notebook.');
        setIsExporting(false);
        return;
      }
      
      // Create Excel-compatible CSV content with UTF-8 BOM
      const headers = ['Content 1', 'Content 2'];
      const csvContent = [
        headers.join('\t'),
        ...notes.map(note => [
          (note.content1 || '').replace(/\t/g, ' '),
          (note.content2 || '').replace(/\t/g, ' ')
        ].join('\t'))
      ].join('\n');
      
      // Create and download file with UTF-8 BOM for Excel compatibility
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedNotebook?.name || 'notebook'}-notes.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Failed to export notes. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="">
            Customize your Duonote experience
          </p>
        </div>

        {/* Settings Content */}
        <div className="card bg-base-100 rounded-xl">
          <div className="card-body">
            <div className="space-y-8">


              {/* Export Notes Setting */}
              <div className="form-control">
                <label className="label">
                  Export Notes
                </label>
                {notebooks.length === 0 ? (
                  <div className="text-base text-base-content/60">
                    You don&apos;t have any notebooks to export.
                  </div>
                ) : (
                  <div className="space-y-0">
                    <select 
                      className="select w-full"
                      value={selectedNotebookForExport}
                      onChange={(e) => setSelectedNotebookForExport(e.target.value)}
                    >
                      <option value="">Select a notebook to export</option>
                      {notebooks.map((notebook) => (
                        <option key={notebook.id} value={notebook.id}>
                          {notebook.name} {notebook.languagePair && `(${notebook.languagePair})`}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-base-content/50 mt-1">
                      Download all notes from the currently active notebook
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-2 justify-end mt-4 md:mt-0">
                      <button
                        className="btn btn-neutral"
                        onClick={exportToCSV}
                        disabled={!selectedNotebookForExport || isExporting}
                      >
                        {isExporting ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Exporting...
                          </>
                        ) : (
                          "Export as CSV"
                        )}
                      </button>
                      
                      <button
                        className="btn btn-neutral"
                        onClick={exportToExcel}
                        disabled={!selectedNotebookForExport || isExporting}
                      >
                        {isExporting ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Exporting...
                          </>
                        ) : (
                          "Export as Excel"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="divider"/>

            {/* Action Buttons */}
            <div className="mt-0">
              <div className="flex flex-col md:flex-row gap-2">
                <button 
                  className="btn btn-neutral flex md:flex-1"
                  onClick={onBackToNotes}
                >
                  Back to Notes
                </button>
                <button 
                  className="btn btn-primary flex md:flex-1"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}