"use client";
import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useNotebooks } from "@/contexts/NotebookContext";
import { CreateNotebookData, Notebook } from "@/types/notebook";

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  showFirstTimeMessage?: boolean;
}

const predefinedColors = [
  '#ef4444', // red
  '#f97316', // orange  
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6366f1', // indigo
  '#10b981', // emerald
];

const commonLanguages = [
  'English',
  'Spanish', 
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese (Mandarin)',
  'Japanese',
  'Korean',
  'Arabic',
  'Russian',
  'Hindi',
  'Dutch',
  'Swedish',
  'Norwegian',
  'Polish',
  'Thai',
  'Vietnamese',
  'Other'
];

const MAX_NOTEBOOKS = 10;

export default function NotebookModal({ isOpen, onClose, showFirstTimeMessage = false }: NotebookModalProps) {
  const { notebooks, currentNotebook, setCurrentNotebook, createNotebook, deleteNotebook, loading, error } = useNotebooks();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateNotebookData>({
    name: '',
    description: '',
    color: predefinedColors[0],
    languagePair: ''
  });
  const [language1, setLanguage1] = useState(commonLanguages[0]);
  const [language2, setLanguage2] = useState(commonLanguages[1]);
  const [customLanguage1, setCustomLanguage1] = useState('');
  const [customLanguage2, setCustomLanguage2] = useState('');
  const [showCustom1, setShowCustom1] = useState(false);
  const [showCustom2, setShowCustom2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        color: predefinedColors[0],
        languagePair: ''
      });
      setLanguage1(commonLanguages[0]);
      setLanguage2(commonLanguages[1]);
      setCustomLanguage1('');
      setCustomLanguage2('');
      setShowCustom1(false);
      setShowCustom2(false);
    }
  }, [isOpen]);

  // Update language pair when individual languages change
  useEffect(() => {
    const lang1 = language1 === 'Other' ? customLanguage1 : language1;
    const lang2 = language2 === 'Other' ? customLanguage2 : language2;
    
    if (lang1 && lang2) {
      setFormData(prev => ({ ...prev, languagePair: `${lang1} ↔ ${lang2}` }));
    }
  }, [language1, language2, customLanguage1, customLanguage2]);

  const handleLanguage1Change = (value: string) => {
    setLanguage1(value);
    setShowCustom1(value === 'Other');
    if (value !== 'Other') {
      setCustomLanguage1('');
    }
  };

  const handleLanguage2Change = (value: string) => {
    setLanguage2(value);
    setShowCustom2(value === 'Other');
    if (value !== 'Other') {
      setCustomLanguage2('');
    }
  };

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    // Check notebook limit
    if (notebooks.length >= MAX_NOTEBOOKS) {
      alert(`You can only create up to ${MAX_NOTEBOOKS} notebooks. Please delete an existing notebook first.`);
      return;
    }

    // Validate custom language inputs if "Other" is selected
    if (language1 === 'Other' && !customLanguage1.trim()) {
      alert('Please enter the first language name');
      return;
    }
    
    if (language2 === 'Other' && !customLanguage2.trim()) {
      alert('Please enter the second language name');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createNotebook(formData);
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        color: predefinedColors[0],
        languagePair: ''
      });
      setLanguage1(commonLanguages[0]);
      setLanguage2(commonLanguages[1]);
      setCustomLanguage1('');
      setCustomLanguage2('');
      setShowCustom1(false);
      setShowCustom2(false);
    } catch (err) {
      console.error('Failed to create notebook:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotebook = async (notebook: Notebook) => {
    if (notebooks.length <= 1) {
      alert('Cannot delete the last notebook');
      return;
    }

    if (confirm(`Are you sure you want to delete "${notebook.name}"? This action cannot be undone.`)) {
      try {
        await deleteNotebook(notebook.id);
      } catch (err) {
        console.error('Failed to delete notebook:', err);
      }
    }
  };

  const handleSelectNotebook = (notebook: Notebook) => {
    setCurrentNotebook(notebook);
  };

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Notebooks</h3>
          <div className="text-sm text-base-content/60">
            {notebooks.length}/{MAX_NOTEBOOKS}
          </div>
        </div>
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* First time user message */}
            {showFirstTimeMessage && notebooks.length === 0 && (
              <div className="alert alert-info">
                <div>
                  <h3 className="font-bold">Welcome to Duonote! 🎉</h3>
                  <div className="text-sm mt-1">
                    To create your first note, you need to first create a notebook. 
                    Notebooks help you organize your vocabulary by language pairs or topics.
                  </div>
                  <div className="text-xs mt-2 opacity-75">
                    For example: "English ↔ Japanese" or "Business Vocabulary"
                  </div>
                </div>
              </div>
            )}

            {/* Existing Notebooks */}
            <div className="space-y-2">
              {notebooks.map((notebook) => (
                <div 
                  key={notebook.id} 
                  className={`card bg-base-100 border cursor-pointer transition-all ${
                    currentNotebook?.id === notebook.id ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-base-400'
                  }`}
                  onClick={() => handleSelectNotebook(notebook)}
                >
                  <div className="card-body p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: notebook.color || predefinedColors[0] }}
                        ></div>
                        <div className="flex-1">
                          <div className="font-medium">{notebook.name}</div>
                          {notebook.languagePair && (
                            <div className="text-sm text-base-content/60">{notebook.languagePair}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentNotebook?.id === notebook.id && (
                          <CheckIcon className="h-4 w-4 text-primary" />
                        )}
                        <button
                          className="btn btn-ghost btn-sm btn-circle text-error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotebook(notebook);
                          }}
                          disabled={notebooks.length <= 1}
                          title={notebooks.length <= 1 ? "Cannot delete the last notebook" : "Delete notebook"}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Create New Notebook */}
            {!showCreateForm ? (
              <div>
                <button
                  className="btn btn-outline btn-block"
                  onClick={() => setShowCreateForm(true)}
                  disabled={notebooks.length >= MAX_NOTEBOOKS}
                  title={notebooks.length >= MAX_NOTEBOOKS ? `Maximum ${MAX_NOTEBOOKS} notebooks allowed` : "Create New Notebook"}
                >
                  <PlusIcon className="h-4 w-4" />
                  Create New Notebook
                </button>
                {notebooks.length >= MAX_NOTEBOOKS && (
                  <div className="text-xs text-warning mt-2 text-center">
                    Maximum {MAX_NOTEBOOKS} notebooks reached. Delete a notebook to create a new one.
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleCreateNotebook} className="card bg-base-200 border-base-400">
                <div className="card-body p-0 space-y-3">
                  <div className="form-control">
                    <input
                      type="text"
                      placeholder="Notebook name"
                      className="input input-bordered input-sm w-full"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      autoFocus
                      required
                    />
                  </div>
                  
                  {/* Language pair selection */}
                  <div className="form-control">
                    <label className="label label-text text-xs">Language Pair</label>
                    <div className="grid gap-2 items-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                      {/* Language 1 */}
                      <div className="space-y-1">
                        <select
                          className="select select-bordered select-sm w-full"
                          value={language1}
                          onChange={(e) => handleLanguage1Change(e.target.value)}
                        >
                          {commonLanguages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                        {showCustom1 && (
                          <input
                            type="text"
                            placeholder="Enter language"
                            className="input input-bordered input-sm w-full"
                            value={customLanguage1}
                            onChange={(e) => setCustomLanguage1(e.target.value)}
                          />
                        )}
                      </div>
                      
                      {/* Arrow */}
                      <div className="flex justify-center items-center px-2">
                        <span className="text-base-content/60">↔</span>
                      </div>
                      
                      {/* Language 2 */}
                      <div className="space-y-1">
                        <select
                          className="select select-bordered select-sm w-full"
                          value={language2}
                          onChange={(e) => handleLanguage2Change(e.target.value)}
                        >
                          {commonLanguages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                        {showCustom2 && (
                          <input
                            type="text"
                            placeholder="Enter language"
                            className="input input-bordered input-sm w-full"
                            value={customLanguage2}
                            onChange={(e) => setCustomLanguage2(e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label label-text text-xs">Color</label>
                    <div className="flex gap-2">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`w-6 h-6 rounded-full border-2 ${
                            formData.color === color ? 'border-base-content' : 'border-base-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      className="btn btn-outline btn-sm flex-1"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm flex-1"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm flex-1"
                      disabled={!formData.name.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        'Create'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Close button for when not in create form mode */}
        {!showCreateForm && (
          <div className="modal-action">
            <button className="btn btn-outline btn-block" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}