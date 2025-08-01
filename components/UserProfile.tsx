"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import { ChevronDown, User as UserIcon, Settings, LogOut } from "lucide-react";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md bg-dark-300 hover:bg-dark-600 transition-colors duration-200"
        aria-label="User profile menu"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-dark-100" />
        </div>
        <span className="text-light-100 font-medium hidden sm:block">
          {user.name || user.email}
        </span>
        <ChevronDown className={`w-4 h-4 text-light-100 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-dark-300 rounded-md shadow-lg border border-dark-600 z-20">
            <div className="p-4 border-b border-dark-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-dark-100" />
                </div>
                <div>
                  <p className="text-white font-semibold">{user.name || 'User'}</p>
                  <p className="text-light-100 text-sm">{user.email}</p>
                  {user.role && (
                    <p className="text-primary text-xs capitalize">{user.role}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => {
                  // Navigate to profile page
                  window.location.href = '/my-profile';
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-light-100 hover:bg-dark-600 rounded-md transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                My Profile
              </button>
              
              <button
                onClick={() => {
                  // Navigate to settings page
                  window.location.href = '/settings';
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-light-100 hover:bg-dark-600 rounded-md transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              
              <div className="border-t border-dark-600 my-2" />
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 