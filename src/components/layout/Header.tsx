"use client";
import React from "react";
import { HomeIcon, PlusIcon, MagnifyingGlassIcon, UserIcon, BoltIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/ui/SearchInput";
import AddNoteModal from "@/components/modals/AddNoteModal";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export default function Header() {
  const router = useRouter();
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = React.useState(false);
  const isOnline = useNetworkStatus();

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

  return (
    <header className="navbar bg-base-100 border-b fixed top-0 z-50 w-full">
      <div className="navbar-start">
        {/* Logo icon - visible on all screen sizes */}
        <button 
          className="btn btn-ghost btn-circle"
          onClick={handleLogoClick}
          title="Go to Home"
        >
          <BookOpenIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="navbar-center flex-1 px-4">
        <div className="flex items-center gap-2 w-full max-w-md">
          {/* Search input - full width on small screens, limited on larger */}
          <SearchInput className="flex-1 sm:w-full md:w-80" />
          
          {/* Add note button - just plus icon */}
          <button 
            className="btn btn-ghost btn-circle" 
            onClick={openAddNoteModal}
            title="Add Note"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="navbar-end">
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
              <li><a>Profile</a></li>
              <li><a>Settings</a></li>
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
    </header>
  );
}