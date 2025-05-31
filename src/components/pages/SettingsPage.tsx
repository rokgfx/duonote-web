"use client";
import React from "react";

interface SettingsPageProps {
  onBackToNotes: () => void;
}

export default function SettingsPage({ onBackToNotes }: SettingsPageProps) {
  const handleSaveSettings = () => {
    // TODO: Implement save settings functionality
    console.log("Save settings clicked");
    // For now, just go back to notes after "saving"
    onBackToNotes();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-base-content mb-2">Settings</h1>
          <p className="text-base-content/60">
            Customize your Duonote experience
          </p>
        </div>

        {/* Settings Content */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title mb-4">App Preferences</h2>
            
            <div className="space-y-4">
              <p className="text-base-content/80">
                Here you can configure various settings for your vocabulary learning experience. 
                Settings options will include language preferences, notification settings, 
                export options, and more.
              </p>
              
              <div className="alert alert-info">
                <div>
                  <h3 className="font-bold">Coming Soon!</h3>
                  <div className="text-sm">
                    We're working on adding more customization options to help you 
                    personalize your learning experience.
                  </div>
                </div>
              </div>

              {/* Placeholder for future settings */}
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Enable notifications</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Dark mode</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Default language pair</span>
                </label>
                <select className="select select-bordered w-full max-w-xs">
                  <option>English ↔ Japanese</option>
                  <option>English ↔ Spanish</option>
                  <option>English ↔ French</option>
                  <option>English ↔ German</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button 
            className="btn btn-outline"
            onClick={onBackToNotes}
          >
            Back to Notes
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSaveSettings}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}