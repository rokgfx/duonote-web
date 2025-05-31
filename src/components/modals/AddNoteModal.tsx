"use client";
import React, { useState } from "react";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function AddNoteModal({ isOpen, onClose, onSave }: AddNoteModalProps) {
  const [content1, setContent1] = useState("");
  const [content2, setContent2] = useState("");

  const MAX_CHARS = 150;

  // Count characters properly handling multibyte characters
  const getCharacterCount = (text: string) => {
    return Array.from(text).length;
  };

  const handleContent1Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (getCharacterCount(text) <= MAX_CHARS) {
      setContent1(text);
    }
  };

  const handleContent2Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (getCharacterCount(text) <= MAX_CHARS) {
      setContent2(text);
    }
  };

  const content1Count = getCharacterCount(content1);
  const content2Count = getCharacterCount(content2);

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Note</h3>
        <div className="py-4 space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Content 1</span>
              <span className="label-text-alt text-sm">
                {content1Count}/{MAX_CHARS}
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24 resize-none"
              rows={3}
              value={content1}
              onChange={handleContent1Change}
            ></textarea>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Content 2</span>
              <span className="label-text-alt text-sm">
                {content2Count}/{MAX_CHARS}
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24 resize-none"
              rows={3}
              value={content2}
              onChange={handleContent2Change}
            ></textarea>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={onSave}>
            Save
          </button>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}