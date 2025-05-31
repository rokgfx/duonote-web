"use client";
import React from "react";
import { HomeIcon, PlusIcon, MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = React.useState(false);

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

  return (
    <header className="navbar bg-base-100 shadow-lg border-b fixed top-0 z-50 w-full">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><a>Categories</a></li>
            <li><a>Search</a></li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">Duonote</a>
      </div>
      
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <button className="btn btn-ghost" onClick={openAddNoteModal}>
              <PlusIcon className="h-5 w-5" />
              Add Note
            </button>
          </li>
          <li>
            <button className="btn btn-ghost">
              <MagnifyingGlassIcon className="h-5 w-5" />
              Search
            </button>
          </li>
        </ul>
      </div>
      
      <div className="navbar-end">
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

      {/* Add Note Modal */}
      <dialog className={`modal ${isAddNoteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Note</h3>
          <p className="py-4">This is where the note creation form will go. You can add your note content here.</p>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleSaveNote}>
              Save
            </button>
            <button className="btn" onClick={closeAddNoteModal}>
              Cancel
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeAddNoteModal}>close</button>
        </form>
      </dialog>
    </header>
  );
}