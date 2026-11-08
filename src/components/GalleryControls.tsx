import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { RarityTier } from '../types/spotter';
import { RARITY_CONFIG } from '../data/carCatalog';

interface GalleryControlsProps {
  rarityFilter: RarityTier | 'all';
  setRarityFilter: (rarity: RarityTier | 'all') => void;
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  makesList: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'rarity-desc' | 'newest' | 'oldest' | 'power-desc';
  setSortBy: (sort: 'rarity-desc' | 'newest' | 'oldest' | 'power-desc') => void;
  rarityCounts: Record<RarityTier, number>;
  totalCount: number;
}

export const GalleryControls: React.FC<GalleryControlsProps> = ({
  rarityFilter,
  setRarityFilter,
  selectedMake,
  setSelectedMake,
  makesList,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  rarityCounts,
  totalCount
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Top row: Search input & Sort dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search make, model, variant, or spot location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-[#121216] border border-zinc-800 rounded-xl pl-10 pr-9 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters & Sorting */}
        <div className="flex items-center gap-2">
          {/* Make Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="h-11 bg-[#121216] border border-zinc-800 rounded-xl px-3.5 text-xs font-mono text-zinc-300 appearance-none pr-8 focus:outline-none focus:border-zinc-500 cursor-pointer"
            >
              <option value="all">All Makes</option>
              {makesList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-11 bg-[#121216] border border-zinc-800 rounded-xl px-3.5 text-xs font-mono text-zinc-300 appearance-none pr-8 focus:outline-none focus:border-zinc-500 cursor-pointer"
            >
              <option value="rarity-desc">Sort: Rarity (Legendary first)</option>
              <option value="newest">Sort: Newest Spotted</option>
              <option value="oldest">Sort: Oldest Spotted</option>
              <option value="power-desc">Sort: Highest Horsepower</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Rarity Segmented Filter Controls */}
      <div className="flex items-center gap-1.5 p-1 bg-[#121216] rounded-xl border border-zinc-800/80 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setRarityFilter('all')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            rarityFilter === 'all'
              ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>All Tiers</span>
          <span className="text-[10px] opacity-70 font-mono">({totalCount})</span>
        </button>

        {(['legendary', 'epic', 'rare', 'common'] as RarityTier[]).map((tier) => {
          const config = RARITY_CONFIG[tier];
          const isSelected = rarityFilter === tier;
          return (
            <button
              key={tier}
              onClick={() => setRarityFilter(tier)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? `${config.badge} font-bold shadow-sm ring-1 ring-white/10`
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              <span className="font-mono">{config.label}</span>
              <span className="text-[10px] opacity-70 font-mono">({rarityCounts[tier] || 0})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
