"use client";
import React from "react";
import { PlusIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { useNavigation } from "@/contexts/NavigationContext";

interface FirstTimeWelcomeProps {
  hasNotebooks: boolean;
  onCreateFirstNote?: () => void;
}

export default function FirstTimeWelcome({ hasNotebooks, onCreateFirstNote }: FirstTimeWelcomeProps) {
  const { goToNotebooksWithCreate } = useNavigation();

  if (!hasNotebooks) {
    // User has no notebooks - need to create notebook first
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md text-center space-y-6">
          {/* Welcome Icon */}
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <BookOpenIcon className="w-10 h-10 text-primary" />
          </div>
          
          {/* Welcome Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-base-content">
              Welcome to Duonote! 🎉
            </h1>
            <p className="text-lg text-base-content/80">
              Your bilingual vocabulary learning journey starts here.
            </p>
          </div>
          
          {/* Explanation */}
          <div className="bg-base-200 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-base-content">
              Let&apos;s get you set up
            </h3>
            <p className="text-sm text-base-content/70 leading-relaxed">
              To create your first note, you need to create a notebook first. 
              Notebooks help you organize your vocabulary by language pairs or topics.
            </p>
            <div className="text-xs text-base-content/60 space-y-1">
              <p><strong>Examples:</strong></p>
              <p>• &quot;English ↔ Japanese&quot;</p>
              <p>• &quot;Business Vocabulary&quot;</p>
              <p>• &quot;Travel Phrases&quot;</p>
            </div>
          </div>
          
          {/* Call to Action */}
          <button
            onClick={goToNotebooksWithCreate}
            className="btn btn-primary btn-lg gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Create Your First Notebook
          </button>
          
          {/* Additional Help */}
          <p className="text-xs text-base-content/50">
            Don&apos;t worry, you can always create more notebooks later!
          </p>
        </div>
      </div>
    );
  }

  // User has notebooks but no notes
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <div className="max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
          <PlusIcon className="w-8 h-8 text-success" />
        </div>
        
        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-base-content">
            Ready to add your first note?
          </h2>
          <p className="text-base text-base-content/70">
            You have notebooks set up. Now let&apos;s create your first vocabulary entry!
          </p>
        </div>
        
        {/* Explanation */}
        <div className="bg-base-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-base-content/70">
            Each note contains two pieces of content - perfect for vocabulary pairs like words and their translations.
          </p>
        </div>
        
        {/* Call to Action */}
        <button
          onClick={onCreateFirstNote}
          className="btn btn-success btn-lg gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Create Your First Note
        </button>
      </div>
    </div>
  );
}