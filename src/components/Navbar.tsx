import React, { useState } from 'react';
import { Camera, Sparkles, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { RarityTier } from '../types/spotter';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  onOpenAddModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalSpots: number;
  rarityCounts: Record<RarityTier, number>;
  currentUser: FirebaseUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  activeTab,
  setActiveTab,
  totalSpots,
  rarityCounts,
  currentUser,
  onSignIn,
  onSignOut
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0c]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setActiveTab('gallery'); }}
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-sm"
        >
          <span className="w-2.5 h-2.5 bg-amber-400 rounded-xs shadow-[0_0_10px_rgba(251,191,36,0.6)] group-hover:scale-110 transition-transform" />
          <span className="font-mono tracking-widest text-lg">SPOTTER</span>
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer ${
              activeTab === 'gallery' ? 'text-white font-semibold' : ''
            }`}
          >
            Car Gallery ({totalSpots})
          </button>
          <button
            onClick={() => setActiveTab('legendary')}
            className={`whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'legendary' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Legendary Hall ({rarityCounts.legendary})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer ${
              activeTab === 'stats' ? 'text-white font-semibold' : ''
            }`}
          >
            Spotter Radar
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer ${
              activeTab === 'saved' ? 'text-white font-semibold' : ''
            }`}
          >
            Saved Collection
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Auth Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 transition-all cursor-pointer"
              >
                <span className="text-xs font-mono text-zinc-300 max-w-[100px] truncate hidden sm:inline">
                  {currentUser.displayName || 'Spotter'}
                </span>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Avatar'}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-600"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-[#121216] border border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 border-b border-zinc-800">
                    <p className="text-xs font-bold text-white truncate">{currentUser.displayName || 'Spotter'}</p>
                    <p className="text-[10px] text-zinc-500 truncate font-mono">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="h-9 px-3 rounded-lg border border-zinc-700 hover:border-zinc-500 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="h-10 px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs tracking-wider uppercase rounded-lg transition-all duration-150 flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Camera className="w-4 h-4 text-zinc-900" />
            <span>Spot a Car</span>
          </button>
        </div>

      </div>
    </header>
  );
};
