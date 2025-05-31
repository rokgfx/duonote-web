"use client";
import React from "react";
import { HomeIcon, PlusIcon, MagnifyingGlassIcon, UserIcon, BoltIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/ui/SearchInput";
import AddNoteModal from "@/components/modals/AddNoteModal";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useNavigation } from "@/contexts/NavigationContext";

export default function Header() {
  const router = useRouter();
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = React.useState(false);
  const isOnline = useNetworkStatus();
  const { goToSettings, goToProfile } = useNavigation();

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/");
  };

  const openAddNoteModal = () => {
    setIsAddNoteModalOpen(true);
  };

  const closeAddNoteModal = () => {
    setIsAddNoteModalOpen(false);
  };

  const handleSaveNote = () => {
    // TODO: Implement save note functionality
    console.log("Save note clicked");
    closeAddNoteModal();
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSettingsClick = () => {
    goToSettings();
    // Close the dropdown by removing focus
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
  };

  const handleProfileClick = () => {
    goToProfile();
    // Close the dropdown by removing focus
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }
  };

  return (
    <header className="navbar bg-base-100 border-b fixed top-0 z-50 w-full">
      <div className="navbar-start w-auto">
        {/* Logo icon - visible on all screen sizes */}
        <button 
          className="btn btn-ghost btn-circle"
          onClick={handleLogoClick}
          title="Go to Home"
        >
          <BookOpenIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="navbar-center flex-1">
        {/* Desktop: Match notes list width (max-w-2xl), Mobile: Full width between icons */}
        <div className="container mx-auto px-2 max-w-2xl">
          <div className="flex items-center w-full">
            {/* Search input */}
            <SearchInput className="flex-1" />
            
            {/* Add note button - hidden on mobile, shown on desktop */}
            <button 
              className="btn btn-ghost btn-circle hidden md:flex ml-4" 
              onClick={openAddNoteModal}
              title="Add Note"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="navbar-end w-auto">
        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="tooltip tooltip-bottom" data-tip="Offline">
              <BoltIcon className="h-5 w-5 text-warning" />
            </div>
          )}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <UserIcon className="h-6 w-6" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><button onClick={handleProfileClick}>Profile</button></li>
              <li><button onClick={handleSettingsClick}>Settings</button></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

      <AddNoteModal 
        isOpen={isAddNoteModalOpen}
        onClose={closeAddNoteModal}
        onSave={handleSaveNote}
      />

      {/* Floating add button for mobile only */}
      <button
        className="fixed bottom-6 right-6 btn btn-primary btn-circle shadow-lg z-50 md:hidden"
        onClick={openAddNoteModal}
        title="Add Note"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
    </header>
  );
}