"use client";
import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, CheckIcon, ArrowLeftIcon, EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useNotebooks } from "@/contexts/NotebookContext";
import { useModal } from "@/contexts/ModalContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { CreateNotebookData, Notebook } from "@/types/notebook";
import { useNoteCounts } from "@/hooks/useNoteCounts";

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
  const { notebooks, currentNotebook, setCurrentNotebook, createNotebook, updateNotebook, deleteNotebook, loading, error } = useNotebooks();
  const { showConfirmation, showAlert } = useModal();
  const { getNoteCount } = useNoteCounts();
  const { shouldShowCreateForm, clearCreateForm } = useNavigation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotebook, setEditingNotebook] = useState<Notebook | null>(null);
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
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper variables
  const isEditing = !!editingNotebook;
  const isFormOpen = showCreateForm || isEditing;

  // Automatically show create form when coming from welcome page
  useEffect(() => {
    if (shouldShowCreateForm) {
      setShowCreateForm(true);
      clearCreateForm(); // Clear the flag to prevent reopening
    }
  }, [shouldShowCreateForm, clearCreateForm]);

  // Reset form when showCreateForm changes or editing ends
  useEffect(() => {
    if (!isFormOpen) {
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
      setEditingNotebook(null);
    }
  }, [isFormOpen]);

  // Populate form when editing a notebook
  useEffect(() => {
    if (editingNotebook) {
      setFormData({
        name: editingNotebook.name,
        description: editingNotebook.description || '',
        color: editingNotebook.color || predefinedColors[0],
        languagePair: editingNotebook.languagePair || ''
      });

      // Parse language pair back to individual languages
      if (editingNotebook.languagePair) {
        const [lang1, lang2] = editingNotebook.languagePair.split(' ↔ ');
        
        // Check if languages are in the common list or custom
        const isLang1Common = commonLanguages.includes(lang1);
        const isLang2Common = commonLanguages.includes(lang2);
        
        setLanguage1(isLang1Common ? lang1 : 'Other');
        setLanguage2(isLang2Common ? lang2 : 'Other');
        
        setCustomLanguage1(isLang1Common ? '' : lang1);
        setCustomLanguage2(isLang2Common ? '' : lang2);
        
        setShowCustom1(!isLang1Common);
        setShowCustom2(!isLang2Common);
      }
    }
  }, [editingNotebook]);

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

  const handleEditNotebook = (notebook: Notebook) => {
    setEditingNotebook(notebook);
    setShowCreateForm(false);
  };

  const handleSaveNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    // Check notebook limit only for new notebooks
    if (!isEditing && notebooks.length >= MAX_NOTEBOOKS) {
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
      if (isEditing && editingNotebook) {
        await updateNotebook(editingNotebook.id, formData);
        // Add 800ms delay for better UX
        setTimeout(() => {
          setEditingNotebook(null);
          setIsSubmitting(false);
        }, 800);
      } else {
        await createNotebook(formData);
        // Add 800ms delay for better UX
        setTimeout(() => {
          setShowCreateForm(false);
          setIsSubmitting(false);
        }, 800);
      }
    } catch (err) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} notebook:`, err);
      showAlert({
        title: 'Error',
        message: `Failed to ${isEditing ? 'update' : 'create'} notebook. Please try again.`
      });
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
        setIsDeleting(true);
        try {
          await deleteNotebook(notebook.id);
          // Add 800ms delay and transition to notebooks list
          setTimeout(() => {
            setIsDeleting(false);
            setEditingNotebook(null);
            setShowCreateForm(false);
          }, 800);
        } catch (err) {
          console.error('Failed to delete notebook:', err);
          setIsDeleting(false);
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
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <button 
              onClick={isFormOpen ? () => { setShowCreateForm(false); setEditingNotebook(null); } : onBackToNotes}
              className="btn btn-ghost btn-circle"
              title={isFormOpen ? "Back to Notebooks" : "Back to Notes"}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <h1 className="text-4xl font-bold">
              {isEditing ? "Edit Notebook" : (showCreateForm ? "Create Notebook" : "Notebooks")}
            </h1>
          </div>
          <p className="">
            {isFormOpen 
              ? (isEditing ? "Edit your notebook details" : "Create a new notebook to organize your vocabulary")
              : "Organize your vocabulary by language pairs or topics"
            }
          </p>
          {!isFormOpen && (
            <div className="text-sm mt-1">
              {notebooks.length}/{MAX_NOTEBOOKS} notebooks
            </div>
          )}
        </div>

        {/* Notebooks Content */}
        <div className="card bg-base-100 rounded-xl">
          <div className="card-body">
            {error && (
              <div className="alert mb-4">
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-4">
                {!isFormOpen ? (
                  <>
                    {/* First time user message */}
                    {showFirstTimeMessage && notebooks.length === 0 && (
                      <div className="alert">
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
                          className={`card rounded-xl cursor-pointer transition-all ${
                            currentNotebook?.id === notebook.id ? 'border border-base-300' : 'border-none hover:bg-base-200'
                          }`}
                          onClick={() => handleSelectNotebook(notebook)}
                        >
                          <div className="card-body">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: notebook.color || predefinedColors[0] }}
                                ></div>
                                <div className="flex-1">
                                  <div className="text-base font-bold">{notebook.name}</div>
                                  {notebook.languagePair && (
                                    <div className="text-base">{notebook.languagePair}</div>
                                  )}
                                  <div className="text-sm text-base-content/60 mt-1">
                                    {getNoteCount(notebook.id)} {getNoteCount(notebook.id) === 1 ? 'note' : 'notes'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {currentNotebook?.id === notebook.id && (
                                  <CheckIcon className="h-6 w-6" />
                                )}
                                <button
                                  className="btn btn-ghost btn-sm btn-circle"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditNotebook(notebook);
                                  }}
                                  title="Edit notebook"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8">
                      <div className="flex flex-col md:flex-row gap-2">
                        <button
                          className="btn btn-primary flex md:flex-1"
                          onClick={onBackToNotes}
                          disabled={!currentNotebook}
                          title={!currentNotebook ? "Select a notebook to view its notes" : `View notes in ${currentNotebook.name}`}
                        >
                          <EyeIcon className="h-4 w-4" />
                          View Notes
                        </button>
                        <button
                          className="btn btn-neutral flex md:flex-1"
                          onClick={() => setShowCreateForm(true)}
                          disabled={notebooks.length >= MAX_NOTEBOOKS}
                          title={notebooks.length >= MAX_NOTEBOOKS ? `Maximum ${MAX_NOTEBOOKS} notebooks allowed` : "Create New Notebook"}
                        >
                          <PlusIcon className="h-4 w-4" />
                          Create New Notebook
                        </button>
                      </div>
                      {notebooks.length >= MAX_NOTEBOOKS && (
                        <div className="text-xs mt-2 text-center">
                          Maximum {MAX_NOTEBOOKS} notebooks reached. Delete a notebook to create a new one.
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* Create/Edit Notebook Form */
                  <div className="space-y-4">
                    <form onSubmit={handleSaveNotebook} className="space-y-4">
                      <div className="form-control">
                        <label className="label">
                          Notebook Title
                        </label>
                        <input
                          type="text"
                          placeholder="What do you want to call this notebook?"
                          className="input w-full"
                          value={formData.name}
                          onChange={handleNotebookNameChange}
                          autoFocus
                          required
                        />
                        <div className="text-xs text-right mt-1 text-base-content/50">
                          {getNameCharacterCount()}/{MAX_NOTEBOOK_NAME_CHARS}
                        </div>
                      </div>
                      
                      {/* Language pair selection */}
                      <div className="form-control">
                        <label className="label">Language pair</label>
                        <div className="grid gap-2 items-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
                          {/* Language 1 */}
                          <div className="space-y-1">
                            <select
                              className="select w-full"
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
                                className="input w-full "
                                value={customLanguage1}
                                onChange={(e) => setCustomLanguage1(e.target.value)}
                              />
                            )}
                          </div>
                          
                          {/* Arrow */}
                          <div className="flex justify-center items-center px-2">
                            <span className="">↔</span>
                          </div>
                          
                          {/* Language 2 */}
                          <div className="space-y-1">
                            <select
                              className="select w-full "
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
                                className="input w-full "
                                value={customLanguage2}
                                onChange={(e) => setCustomLanguage2(e.target.value)}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="divider"/>

                      <div className="form-control">
                        <label className="label">Color</label>
                        <div className="flex justify-between md:justify-start w-full md:gap-2">
                          {predefinedColors.map(color => (
                            <button
                              key={color}
                              type="button"
                              className={`h-6 w-6 md:h-8 md:w-8 cursor-pointer border-1 rounded-full border-base-300 ${
                                formData.color === color ? 'border-2 border-base-content' : ''
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setFormData(prev => ({ ...prev, color }))}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        {/* Delete button on the left - only show in edit mode */}
                        {isEditing && editingNotebook ? (
                          <button
                            type="button"
                            className="btn btn-neutral"
                            onClick={() => handleDeleteNotebook(editingNotebook)}
                            disabled={isSubmitting || isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <TrashIcon className="h-4 w-4" />
                                Delete
                              </>
                            )}
                          </button>
                        ) : (
                          <div></div>
                        )}
                        
                        {/* Cancel and Save/Create buttons on the right */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => { setShowCreateForm(false); setEditingNotebook(null); }}
                            disabled={isSubmitting || isDeleting}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn px-12 btn-primary"
                            disabled={!formData.name.trim() || isSubmitting || isDeleting || language1 === 'Select' || language2 === 'Select' || (language1 === 'Other' && !customLanguage1.trim()) || (language2 === 'Other' && !customLanguage2.trim())}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="loading loading-spinner loading-sm"></span>
                                {isEditing ? 'Saving...' : 'Creating...'}
                              </>
                            ) : (
                              isEditing ? 'Save' : 'Create'
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}