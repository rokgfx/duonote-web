"use client";
import React, { useState } from "react";
import { useNotebooks } from "@/contexts/NotebookContext";

interface SettingsPageProps {
  onBackToNotes: () => void;
}

export default function SettingsPage({ onBackToNotes }: SettingsPageProps) {
  const { notebooks, currentNotebook, setCurrentNotebook } = useNotebooks();
  const [isSaving, setIsSaving] = useState(false);

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

  const handleDefaultNotebookChange = (notebookId: string) => {
    const notebook = notebooks.find(nb => nb.id === notebookId);
    if (notebook) {
      setCurrentNotebook(notebook);
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
            <div className="space-y-4">
              <p className="text-base leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              
              <p className="text-base leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <div className="divider"/>

              {/* Default Notebook Setting */}
              <div className="form-control">
                <label className="label">
                  Default Notebook
                </label>
                {notebooks.length === 0 ? (
                  <div className="text-base text-base-content/60">
                    You don't have any notebooks yet. Create one to get started.
                  </div>
                ) : notebooks.length === 1 ? (
                  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-full">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: notebooks[0].color }}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium">{notebooks[0].name}</div>
                      {notebooks[0].languagePair && (
                        <div className="text-sm text-base-content/60">{notebooks[0].languagePair}</div>
                      )}
                    </div>
                    <div className="text-sm text-base-content/60">Only notebook</div>
                  </div>
                ) : (
                  <select 
                    className="select w-full"
                    value={currentNotebook?.id || ''}
                    onChange={(e) => handleDefaultNotebookChange(e.target.value)}
                  >
                    {notebooks.map((notebook) => (
                      <option key={notebook.id} value={notebook.id}>
                        {notebook.name} {notebook.languagePair && `(${notebook.languagePair})`}
                      </option>
                    ))}
                  </select>
                )}
                <div className="text-xs text-base-content/50 mt-1">
                  New notes will be added to this notebook by default
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8">
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