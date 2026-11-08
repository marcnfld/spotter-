import React from 'react';
import { CarSpot, RarityTier } from '../types/spotter';
import { RARITY_CONFIG } from '../data/carCatalog';
import { Gauge, ShieldAlert, Award, Zap, TrendingUp, Camera, MapPin } from 'lucide-react';

interface StatsViewProps {
  spots: CarSpot[];
  onOpenAddModal: () => void;
  onSelectSpot: (spot: CarSpot) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  spots,
  onOpenAddModal,
  onSelectSpot
}) => {
  // Aggregate stats
  const totalSpots = spots.length;
  const legendarySpots = spots.filter((s) => s.rarity === 'legendary');
  const epicSpots = spots.filter((s) => s.rarity === 'epic');
  const rareSpots = spots.filter((s) => s.rarity === 'rare');
  const commonSpots = spots.filter((s) => s.rarity === 'common');

  const totalHp = spots.reduce((sum, s) => sum + (s.specs.hp || 0), 0);
  const avgHp = totalSpots > 0 ? Math.round(totalHp / totalSpots) : 0;

  // Make breakdown
  const makeCounts: Record<string, number> = {};
  spots.forEach((s) => {
    makeCounts[s.make] = (makeCounts[s.make] || 0) + 1;
  });
  const topMakes = Object.entries(makeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-semibold">
            Telemetry & Registry Analysis
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            Spotter Radar
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Live metrics on spotted automotive machinery, rarity distributions, and horsepower cataloging.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="h-10 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0 shadow-lg"
        >
          <Camera className="w-4 h-4 text-zinc-900" />
          <span>New Spot</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121216] border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total Spotted</span>
            <Award className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalSpots}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Across {Object.keys(makeCounts).length} manufacturers
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121216] border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.06)]">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Legendary Tiers</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
            {legendarySpots.length}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Hypercars & Holy Grail icons
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121216] border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Cataloged HP</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {totalHp.toLocaleString()} <span className="text-sm font-normal text-zinc-500">HP</span>
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Avg {avgHp} HP per spotted vehicle
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#121216] border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Estimated Fleet</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            $15.2M+
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            Combined collector valuation
          </span>
        </div>
      </div>

      {/* Rarity Tier Distribution Breakdown */}
      <div className="p-6 rounded-2xl bg-[#121216] border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
            Rarity Distribution Spectrum
          </h3>
          <span className="text-xs font-mono text-zinc-500">
            {totalSpots} Total Entries
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-3 w-full rounded-full bg-zinc-900 overflow-hidden flex p-0.5 border border-zinc-800">
          <div 
            style={{ width: `${(legendarySpots.length / totalSpots) * 100}%` }}
            className="h-full bg-amber-400 transition-all rounded-l-full"
            title={`Legendary: ${legendarySpots.length}`}
          />
          <div 
            style={{ width: `${(epicSpots.length / totalSpots) * 100}%` }}
            className="h-full bg-purple-500 transition-all"
            title={`Epic: ${epicSpots.length}`}
          />
          <div 
            style={{ width: `${(rareSpots.length / totalSpots) * 100}%` }}
            className="h-full bg-cyan-400 transition-all"
            title={`Rare: ${rareSpots.length}`}
          />
          <div 
            style={{ width: `${(commonSpots.length / totalSpots) * 100}%` }}
            className="h-full bg-zinc-600 transition-all rounded-r-full"
            title={`Common: ${commonSpots.length}`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {(['legendary', 'epic', 'rare', 'common'] as RarityTier[]).map((tier) => {
            const count = spots.filter((s) => s.rarity === tier).length;
            const pct = totalSpots > 0 ? Math.round((count / totalSpots) * 100) : 0;
            const config = RARITY_CONFIG[tier];
            return (
              <div key={tier} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                  <span className="text-xs font-mono uppercase font-semibold text-zinc-300">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-white font-mono tabular-nums">
                    {count}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 tabular-nums">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Spotted Manufacturers & Recent Hall of Fame */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Makes */}
        <div className="p-6 rounded-2xl bg-[#121216] border border-zinc-800/80 space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
            Top Spotted Marques
          </h3>
          <div className="space-y-2.5">
            {topMakes.map(([make, count]) => {
              const percentage = Math.round((count / totalSpots) * 100);
              return (
                <div key={make} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-200 font-semibold">{make}</span>
                    <span className="text-zinc-400 tabular-nums">{count} cars ({percentage}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-zinc-300 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legendary Spotlight List */}
        <div className="p-6 rounded-2xl bg-[#121216] border border-zinc-800/80 space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
            Legendary Hall of Fame
          </h3>
          <div className="space-y-2.5">
            {legendarySpots.length === 0 ? (
              <p className="text-xs text-zinc-500">No Legendary vehicles spotted yet. Be the first!</p>
            ) : (
              legendarySpots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => onSelectSpot(spot)}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={spot.photos[0]}
                      alt={spot.model}
                      className="w-12 h-9 object-cover rounded-md"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {spot.make} {spot.model}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        {spot.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {spot.specs.estValue || 'LEGENDARY'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
