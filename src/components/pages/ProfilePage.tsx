"use client";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/lib/firebase";

interface ProfilePageProps {
  onBackToNotes: () => void;
}

export default function ProfilePage({ onBackToNotes }: ProfilePageProps) {
  const [user] = useAuthState(auth!);

  const handleSaveProfile = () => {
    // TODO: Implement save profile functionality
    console.log("Save profile clicked");
    // For now, just go back to notes after "saving"
    onBackToNotes();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-base-content mb-2">Profile</h1>
          <p className="text-base-content/60">
            Manage your account information
          </p>
        </div>

        {/* Profile Content */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title mb-4">Account Information</h2>
            
            <div className="space-y-6">
              {/* User Info */}
              <div className="alert alert-info">
                <div>
                  <h3 className="font-bold">Current User</h3>
                  <div className="text-sm">
                    {user?.email || "No email available"}
                  </div>
                  <div className="text-xs text-base-content/60 mt-1">
                    User ID: {user?.uid || "Not available"}
                  </div>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Profile Picture</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {user?.email?.charAt(0).toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm">Change Photo</button>
                </div>
              </div>

              {/* Display Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Display Name</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your display name" 
                  className="input input-bordered w-full"
                  defaultValue={user?.displayName || ""}
                />
              </div>

              {/* Email (Read-only) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input 
                  type="email" 
                  className="input input-bordered w-full bg-base-200" 
                  value={user?.email || ""}
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt">Email cannot be changed</span>
                </label>
              </div>

              {/* Account Stats */}
              <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                <div className="stat">
                  <div className="stat-title">Total Notes</div>
                  <div className="stat-value text-primary">-</div>
                  <div className="stat-desc">Coming soon</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Account Created</div>
                  <div className="stat-value text-secondary text-lg">
                    {user?.metadata?.creationTime ? 
                      new Date(user.metadata.creationTime).toLocaleDateString() : 
                      "Unknown"
                    }
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="alert alert-warning">
                <div>
                  <h3 className="font-bold">Account Management</h3>
                  <div className="text-sm mb-2">
                    Manage your account settings and data.
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm">Export Data</button>
                    <button className="btn btn-error btn-sm">Delete Account</button>
                  </div>
                </div>
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
            onClick={handleSaveProfile}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}