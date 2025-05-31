"use client";
import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, CheckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNotebooks } from "@/contexts/NotebookContext";
import { useModal } from "@/contexts/ModalContext";
import { CreateNotebookData, Notebook } from "@/types/notebook";

interface NotebookPageProps {
  onBackToNotes: () => void;
  showFirstTimeMessage?: boolean;
}

const predefinedColors = [
  '#E74C3C', // red
  '#F39C12', // orange  
  '#F7DC6F', // yellow
  '#58D68D', // green
  '#AFEEEE', // cyan
  '#1E90FF', // blue
  '#9370DB', // violet
  '#FFC0CB', // pink
  '#F8F8FF', // white
  '#4d5052', // black
];

const commonLanguages = [
  'Select',
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
const MAX_NOTEBOOK_NAME_CHARS = 40;

export default function NotebookPage({ onBackToNotes, showFirstTimeMessage = false }: NotebookPageProps) {
  const { notebooks, currentNotebook, setCurrentNotebook, createNotebook, deleteNotebook, loading, error } = useNotebooks();
  const { showConfirmation, showAlert } = useModal();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateNotebookData>({
    name: '',
    description: '',
    color: predefinedColors[0],
    languagePair: ''
  });
  const [language1, setLanguage1] = useState(commonLanguages[0]); // "Select"
  const [language2, setLanguage2] = useState(commonLanguages[0]); // "Select"
  const [customLanguage1, setCustomLanguage1] = useState('');
  const [customLanguage2, setCustomLanguage2] = useState('');
  const [showCustom1, setShowCustom1] = useState(false);
  const [showCustom2, setShowCustom2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when showCreateForm changes
  useEffect(() => {
    if (!showCreateForm) {
      setFormData({
        name: '',
        description: '',
        color: predefinedColors[0],
        languagePair: ''
      });
      setLanguage1(commonLanguages[0]); // "Select"
      setLanguage2(commonLanguages[0]); // "Select"
      setCustomLanguage1('');
      setCustomLanguage2('');
      setShowCustom1(false);
      setShowCustom2(false);
    }
  }, [showCreateForm]);

  // Update language pair when individual languages change
  useEffect(() => {
    const lang1 = language1 === 'Other' ? customLanguage1 : language1;
    const lang2 = language2 === 'Other' ? customLanguage2 : language2;
    
    // Only set language pair if both languages are selected and not "Select"
    if (lang1 && lang2 && lang1 !== 'Select' && lang2 !== 'Select') {
      setFormData(prev => ({ ...prev, languagePair: `${lang1} ↔ ${lang2}` }));
    } else {
      setFormData(prev => ({ ...prev, languagePair: '' }));
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

  // Handle notebook name change with character limit
  const handleNotebookNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    // Count multibyte characters properly
    const charCount = Array.from(text).length;
    
    if (charCount <= MAX_NOTEBOOK_NAME_CHARS) {
      setFormData(prev => ({ ...prev, name: text }));
    }
  };

  // Get character count for display
  const getNameCharacterCount = () => {
    return Array.from(formData.name).length;
  };

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    // Check notebook limit
    if (notebooks.length >= MAX_NOTEBOOKS) {
      showAlert({
        title: 'Notebook Limit Reached',
        message: `You can only create up to ${MAX_NOTEBOOKS} notebooks. Please delete an existing notebook first.`
      });
      return;
    }

    // Validate that both languages are selected
    if (language1 === 'Select') {
      showAlert({
        title: 'Language Required',
        message: 'Please select the first language.'
      });
      return;
    }

    if (language2 === 'Select') {
      showAlert({
        title: 'Language Required', 
        message: 'Please select the second language.'
      });
      return;
    }

    // Validate custom language inputs if "Other" is selected
    if (language1 === 'Other' && !customLanguage1.trim()) {
      showAlert({
        title: 'Language Required',
        message: 'Please enter the first language name.'
      });
      return;
    }
    
    if (language2 === 'Other' && !customLanguage2.trim()) {
      showAlert({
        title: 'Language Required',
        message: 'Please enter the second language name.'
      });
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
      setLanguage1(commonLanguages[0]); // "Select"
      setLanguage2(commonLanguages[0]); // "Select"
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
      showAlert({
        title: 'Cannot Delete Notebook',
        message: 'Cannot delete the last notebook. You must have at least one notebook.'
      });
      return;
    }

    showConfirmation({
      title: 'Delete Notebook',
      message: `Are you sure you want to delete "${notebook.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'error',
      onConfirm: async () => {
        try {
          await deleteNotebook(notebook.id);
        } catch (err) {
          console.error('Failed to delete notebook:', err);
          showAlert({
            title: 'Error',
            message: 'Failed to delete notebook. Please try again.'
          });
        }
      }
    });
  };

  const handleSelectNotebook = (notebook: Notebook) => {
    setCurrentNotebook(notebook);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToNotes}
            className="btn btn-ghost btn-circle"
            title="Back to Notes"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Notebooks</h1>
        </div>
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
              <div className="card-body p-4 space-y-3">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Notebook name</span>
                    <span className="label-text-alt text-sm">
                      {getNameCharacterCount()}/{MAX_NOTEBOOK_NAME_CHARS}
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Notebook name"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={handleNotebookNameChange}
                    autoFocus
                    required
                  />
                </div>
                
                {/* Language pair selection */}
                <div className="form-control">
                  <label className="label label-text">Language Pair</label>
                  <div className="grid gap-2 items-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                    {/* Language 1 */}
                    <div className="space-y-1">
                      <select
                        className="select select-bordered w-full"
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
                          className="input input-bordered w-full"
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
                        className="select select-bordered w-full"
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
                          className="input input-bordered w-full"
                          value={customLanguage2}
                          onChange={(e) => setCustomLanguage2(e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label label-text">Color</label>
                  <div className="flex justify-between w-full">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`h-6 w-6 md:h-8 md:w-8 cursor-pointer rounded-full border-2 ${
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
                    className="btn btn-ghost flex-1"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={!formData.name.trim() || isSubmitting || language1 === 'Select' || language2 === 'Select' || (language1 === 'Other' && !customLanguage1.trim()) || (language2 === 'Other' && !customLanguage2.trim())}
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
    </div>
  );
}