import React from 'react';
import { LayoutGrid, Sparkles, Camera, Gauge, Bookmark } from 'lucide-react';

interface MobileTabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  savedCount: number;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  savedCount
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-zinc-800/90 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        
        {/* Tab 1: Gallery */}
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer transition-colors ${
            activeTab === 'gallery' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 font-mono">
            Gallery
          </span>
        </button>

        {/* Tab 2: Legendary */}
        <button
          onClick={() => setActiveTab('legendary')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer transition-colors ${
            activeTab === 'legendary' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 font-mono">
            Legendary
          </span>
        </button>

        {/* Center Tab: Big Camera Shutter Trigger for iPhone Thumb */}
        <div className="flex items-center justify-center -mt-5">
          <button
            onClick={onOpenAddModal}
            aria-label="Add spot"
            className="w-14 h-14 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.35)] border-2 border-zinc-900 active:scale-90 transition-transform cursor-pointer"
          >
            <Camera className="w-6 h-6 text-zinc-900 stroke-[2.2]" />
          </button>
        </div>

        {/* Tab 4: Radar / Stats */}
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer transition-colors ${
            activeTab === 'stats' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Gauge className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 font-mono">
            Radar
          </span>
        </button>

        {/* Tab 5: Saved */}
        <button
          onClick={() => setActiveTab('saved')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer transition-colors ${
            activeTab === 'saved' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1 font-mono">
            Saved
          </span>
          {savedCount > 0 && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

      </div>
    </div>
  );
};
