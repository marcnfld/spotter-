/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { CarSpot, RarityTier } from './types/spotter';
import { getStoredSpots, saveSpots } from './utils/storage';
import { INITIAL_CAR_SPOTS } from './data/initialSpots';
import { Navbar } from './components/Navbar';
import { CarCard } from './components/CarCard';
import { GalleryControls } from './components/GalleryControls';
import { AddCarModal } from './components/AddCarModal';
import { CarDetailModal } from './components/CarDetailModal';
import { MobileTabBar } from './components/MobileTabBar';
import { StatsView } from './components/StatsView';
import { Camera, Sparkles, Cloud, Wifi, CheckCircle2 } from 'lucide-react';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  subscribeToSpots, 
  createSpotInFirestore, 
  upvoteSpotInFirestore, 
  addPhotosToSpotInFirestore, 
  deleteSpotFromFirestore,
  testConnection 
} from './firebase';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [spots, setSpots] = useState<CarSpot[]>([]);
  const [activeTab, setActiveTab] = useState<string>('gallery');
  const [selectedSpot, setSelectedSpot] = useState<CarSpot | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

  // Gallery filter & sort states
  const [rarityFilter, setRarityFilter] = useState<RarityTier | 'all'>('all');
  const [selectedMake, setSelectedMake] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rarity-desc' | 'newest' | 'oldest' | 'power-desc'>('rarity-desc');

  // Test connection & setup Auth listener
  useEffect(() => {
    testConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore sync & local storage backup
  useEffect(() => {
    // Start with local stored spots first for zero latency
    const localSpots = getStoredSpots();
    if (localSpots.length > 0) {
      setSpots(localSpots);
    }

    // Subscribe to live Firestore updates
    const unsubscribeFirestore = subscribeToSpots(
      (firestoreSpots) => {
        setIsCloudConnected(true);
        if (firestoreSpots.length > 0) {
          // Merge unique spots by ID
          const spotMap = new Map<string, CarSpot>();
          // Put initial spots first
          INITIAL_CAR_SPOTS.forEach(s => spotMap.set(s.id, s));
          // Overlay firestore spots
          firestoreSpots.forEach(s => spotMap.set(s.id, s));
          const merged = Array.from(spotMap.values());
          setSpots(merged);
          saveSpots(merged);
        } else {
          // If firestore is brand new / empty, preserve initial catalog spots
          setSpots(localSpots);
        }
      },
      (error) => {
        console.warn('Firestore subscription fallback to local storage:', error);
        setIsCloudConnected(false);
      }
    );

    return () => unsubscribeFirestore();
  }, []);

  // Sync state & storage
  const handleUpdateSpots = (newSpots: CarSpot[]) => {
    setSpots(newSpots);
    saveSpots(newSpots);
  };

  // Add a new spot with Firestore persistence
  const handleAddSpot = async (newSpot: CarSpot) => {
    const spotWithUser = {
      ...newSpot,
      userId: currentUser?.uid || undefined,
      spotter: currentUser?.displayName || newSpot.spotter
    };

    // Optimistic UI update
    const updated = [spotWithUser, ...spots.filter(s => s.id !== spotWithUser.id)];
    handleUpdateSpots(updated);
    setSelectedSpot(spotWithUser);

    // Save to Firestore
    try {
      await createSpotInFirestore(spotWithUser);
    } catch (err) {
      console.warn('Saved locally, Firestore sync pending:', err);
    }
  };

  // Like a spot with Firestore persistence
  const handleToggleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = spots.find(s => s.id === id);
    const currentLikes = target?.likes || 0;

    // Optimistic UI
    const updated = spots.map((s) => {
      if (s.id === id) {
        return { ...s, likes: s.likes + 1 };
      }
      return s;
    });
    handleUpdateSpots(updated);
    if (selectedSpot?.id === id) {
      setSelectedSpot((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }

    // Write to Firestore
    try {
      await upvoteSpotInFirestore(id, currentLikes);
    } catch (err) {
      console.warn('Upvote saved locally:', err);
    }
  };

  // Save / Bookmark a spot (device-specific personal collection)
  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = spots.map((s) => {
      if (s.id === id) {
        return { ...s, isSaved: !s.isSaved };
      }
      return s;
    });
    handleUpdateSpots(updated);
    if (selectedSpot?.id === id) {
      setSelectedSpot((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    }
  };

  // Add more photos to an existing spot
  const handleAddPhotoToSpot = async (spotId: string, newPhotoUrls: string[]) => {
    const target = spots.find(s => s.id === spotId);
    const currentPhotos = target?.photos || [];

    const updated = spots.map((s) => {
      if (s.id === spotId) {
        return { ...s, photos: [...s.photos, ...newPhotoUrls] };
      }
      return s;
    });
    handleUpdateSpots(updated);
    if (selectedSpot?.id === spotId) {
      setSelectedSpot((prev) => (prev ? { ...prev, photos: [...prev.photos, ...newPhotoUrls] } : null));
    }

    try {
      await addPhotosToSpotInFirestore(spotId, currentPhotos, newPhotoUrls);
    } catch (err) {
      console.warn('Extra photos saved locally:', err);
    }
  };

  // Update/crop a photo on an existing spot
  const handleUpdateSpotPhoto = async (spotId: string, photoIndex: number, newPhotoUrl: string) => {
    const target = spots.find(s => s.id === spotId);
    if (!target) return;
    const updatedPhotos = [...target.photos];
    updatedPhotos[photoIndex] = newPhotoUrl;

    const updated = spots.map(s => s.id === spotId ? { ...s, photos: updatedPhotos } : s);
    handleUpdateSpots(updated);
    if (selectedSpot?.id === spotId) {
      setSelectedSpot((prev) => (prev ? { ...prev, photos: updatedPhotos } : null));
    }

    try {
      await addPhotosToSpotInFirestore(spotId, [], updatedPhotos);
    } catch (err) {
      console.warn('Updated photo saved locally:', err);
    }
  };

  // Delete a spot
  const handleDeleteSpot = async (spotId: string) => {
    const updated = spots.filter((s) => s.id !== spotId);
    handleUpdateSpots(updated);
    if (selectedSpot?.id === spotId) {
      setSelectedSpot(null);
    }

    try {
      await deleteSpotFromFirestore(spotId);
    } catch (err) {
      console.warn('Deleted locally:', err);
    }
  };

  // Auth actions
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Distinct list of makes for filter
  const makesList = useMemo(() => {
    const unique = new Set(spots.map((s) => s.make));
    return Array.from(unique).sort();
  }, [spots]);

  // Counts by rarity
  const rarityCounts = useMemo(() => {
    const counts: Record<RarityTier, number> = {
      legendary: 0,
      epic: 0,
      rare: 0,
      common: 0
    };
    spots.forEach((s) => {
      if (counts[s.rarity] !== undefined) {
        counts[s.rarity]++;
      }
    });
    return counts;
  }, [spots]);

  // Saved count
  const savedCount = useMemo(() => {
    return spots.filter((s) => s.isSaved).length;
  }, [spots]);

  // Filter & Sort Logic
  const filteredSpots = useMemo(() => {
    let result = [...spots];

    if (activeTab === 'legendary') {
      result = result.filter((s) => s.rarity === 'legendary');
    } else if (activeTab === 'saved') {
      result = result.filter((s) => s.isSaved);
    }

    if (activeTab === 'gallery' && rarityFilter !== 'all') {
      result = result.filter((s) => s.rarity === rarityFilter);
    }

    if (selectedMake !== 'all') {
      result = result.filter((s) => s.make.toLowerCase() === selectedMake.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.make.toLowerCase().includes(q) ||
          s.model.toLowerCase().includes(q) ||
          (s.variant && s.variant.toLowerCase().includes(q)) ||
          s.location.toLowerCase().includes(q) ||
          s.spotter.toLowerCase().includes(q)
      );
    }

    const rarityWeight: Record<RarityTier, number> = {
      legendary: 4,
      epic: 3,
      rare: 2,
      common: 1
    };

    result.sort((a, b) => {
      if (sortBy === 'rarity-desc') {
        const diff = rarityWeight[b.rarity] - rarityWeight[a.rarity];
        if (diff !== 0) return diff;
        return new Date(b.spottedAt).getTime() - new Date(a.spottedAt).getTime();
      }
      if (sortBy === 'newest') {
        return new Date(b.spottedAt).getTime() - new Date(a.spottedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.spottedAt).getTime() - new Date(b.spottedAt).getTime();
      }
      if (sortBy === 'power-desc') {
        return (b.specs.hp || 0) - (a.specs.hp || 0);
      }
      return 0;
    });

    return result;
  }, [spots, activeTab, rarityFilter, selectedMake, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
      
      {/* Top Bar following Top Bar Contract */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalSpots={spots.length}
        rarityCounts={rarityCounts}
        currentUser={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
        
        {/* TAB 1: RADAR / STATS VIEW */}
        {activeTab === 'stats' ? (
          <StatsView
            spots={spots}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSelectSpot={(spot) => setSelectedSpot(spot)}
          />
        ) : (
          /* TAB 2, 3, 4: CAR GALLERY / LEGENDARY ARCHIVE / SAVED */
          <div className="space-y-6">
            
            {/* Gallery Editorial Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-semibold">
                    {activeTab === 'legendary'
                      ? 'Ultra-Rare Exotics'
                      : activeTab === 'saved'
                      ? 'Personal Registry'
                      : 'Global Live Feed'}
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Firebase Live</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {activeTab === 'legendary'
                    ? 'Legendary Hall'
                    : activeTab === 'saved'
                    ? 'Saved Spots'
                    : 'Car Gallery'}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                  {activeTab === 'legendary'
                    ? 'Homologations, hypercars, and million-dollar Holy Grail icons spotted in the wild.'
                    : activeTab === 'saved'
                    ? 'Vehicles you have bookmarked for your private automotive collection.'
                    : 'Real-time automotive registry synced across spotters with camera capture and instant rarity evaluation.'}
                </p>
              </div>

              {/* Quick stats counter */}
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold">{filteredSpots.length}</span>
                  <span>Vehicles Listed</span>
                </div>
                <span className="text-zinc-700">|</span>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{rarityCounts.legendary} Legendary</span>
                </div>
              </div>
            </div>

            {/* Gallery Search, Rarity & Sort Controls */}
            <GalleryControls
              rarityFilter={rarityFilter}
              setRarityFilter={setRarityFilter}
              selectedMake={selectedMake}
              setSelectedMake={setSelectedMake}
              makesList={makesList}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              rarityCounts={rarityCounts}
              totalCount={spots.length}
            />

            {/* Vehicles Gallery Grid */}
            {filteredSpots.length === 0 ? (
              <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-zinc-800 bg-[#121216]/50">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white">No vehicles found</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  {searchQuery || selectedMake !== 'all' || rarityFilter !== 'all'
                    ? 'Try clearing your search query or adjusting rarity filters.'
                    : 'Be the first spotter to log an exotic supercar in the wild!'}
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  Spot a Car Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpots.map((spot) => (
                  <CarCard
                    key={spot.id}
                    spot={spot}
                    onSelect={(s) => setSelectedSpot(s)}
                    onToggleLike={handleToggleLike}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Floating Action Button for Mobile & Desktop quick trigger */}
      <div className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-30">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 h-12 px-5 rounded-full bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4 text-zinc-900 stroke-[2.2]" />
          <span>Spot Car</span>
        </button>
      </div>

      {/* iPhone Ergonomic Bottom Tab Navigation */}
      <MobileTabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        savedCount={savedCount}
      />

      {/* Add Car Modal (Camera capture & multi-photo upload) */}
      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSpot={handleAddSpot}
      />

      {/* Car Detail Dossier Modal */}
      <CarDetailModal
        spot={selectedSpot}
        onClose={() => setSelectedSpot(null)}
        onToggleLike={handleToggleLike}
        onToggleSave={handleToggleSave}
        onAddPhotoToSpot={handleAddPhotoToSpot}
        onDeleteSpot={handleDeleteSpot}
        onUpdateSpotPhoto={handleUpdateSpotPhoto}
      />

    </div>
  );
}
