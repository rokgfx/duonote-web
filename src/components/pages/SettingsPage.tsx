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
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}