"use client";
import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useNotebooks } from "@/contexts/NotebookContext";
import { CreateNotebookData, Notebook } from "@/types/notebook";

interface NotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
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
];

const languagePairs = [
  'English ↔ Japanese',
  'English ↔ Spanish', 
  'English ↔ French',
  'English ↔ German',
  'English ↔ Italian',
  'English ↔ Portuguese',
  'English ↔ Chinese',
  'English ↔ Korean',
  'Japanese ↔ Korean',
  'Other'
];

export default function NotebookModal({ isOpen, onClose }: NotebookModalProps) {
  const { notebooks, currentNotebook, setCurrentNotebook, createNotebook, deleteNotebook, loading, error } = useNotebooks();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateNotebookData>({
    name: '',
    description: '',
    color: predefinedColors[0],
    languagePair: languagePairs[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        color: predefinedColors[0],
        languagePair: languagePairs[0]
      });
    }
  }, [isOpen]);

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
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
        languagePair: languagePairs[0]
      });
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
        <h3 className="font-bold text-lg mb-4">Notebooks</h3>
        
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
              <button
                className="btn btn-outline btn-block"
                onClick={() => setShowCreateForm(true)}
              >
                <PlusIcon className="h-4 w-4" />
                Create New Notebook
              </button>
            ) : (
              <form onSubmit={handleCreateNotebook} className="card bg-base-200 border border-dashed border-base-400">
                <div className="card-body p-4 space-y-3">
                  <div className="form-control">
                    <input
                      type="text"
                      placeholder="Notebook name"
                      className="input input-bordered input-sm"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      autoFocus
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <select
                      className="select select-bordered select-sm"
                      value={formData.languagePair}
                      onChange={(e) => setFormData(prev => ({ ...prev, languagePair: e.target.value }))}
                    >
                      {languagePairs.map(pair => (
                        <option key={pair} value={pair}>{pair}</option>
                      ))}
                    </select>
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
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}