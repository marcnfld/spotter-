import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Camera, ImagePlus, Sparkles, MapPin, Check, 
  Trash2, Star, AlertCircle, ChevronDown, Plus, Eye, Crop
} from 'lucide-react';
import { CarSpot, RarityTier, CarSpecs } from '../types/spotter';
import { MANUFACTURER_CATALOG, RARITY_CONFIG, calculateAutoRarity } from '../data/carCatalog';
import { LiveCameraModal } from './LiveCameraModal';
import { PhotoCropModal } from './PhotoCropModal';

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSpot: (spot: CarSpot) => void;
}

export const AddCarModal: React.FC<AddCarModalProps> = ({
  isOpen,
  onClose,
  onAddSpot
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [photos, setPhotos] = useState<string[]>([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState<number>(0);
  const [selectedMake, setSelectedMake] = useState<string>('Porsche');
  const [selectedModel, setSelectedModel] = useState<string>('911 GT3 RS (992)');
  const [customModel, setCustomModel] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('Weissach Package');
  const [customVariant, setCustomVariant] = useState<string>('');
  const [location, setLocation] = useState<string>('Monaco Casino Square');
  const [spotter, setSpotter] = useState<string>('ExoticSpotter_99');
  const [notes, setNotes] = useState<string>('');

  // Crop / Reposition state
  const [cropTargetIndex, setCropTargetIndex] = useState<number | null>(null);

  // Rarity state & auto-assignment
  const [autoRarity, setAutoRarity] = useState<RarityTier>('epic');
  const [rarityReason, setRarityReason] = useState<string>('');
  const [specs, setSpecs] = useState<CarSpecs>({});
  const [manualRarityOverride, setManualRarityOverride] = useState<boolean>(false);
  const [manualRarity, setManualRarity] = useState<RarityTier>('epic');

  // Live Camera Viewfinder modal state
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available models based on manufacturer
  const activeManufacturer = MANUFACTURER_CATALOG.find(
    (m) => m.name.toLowerCase() === selectedMake.toLowerCase()
  );
  const availableModels = activeManufacturer ? activeManufacturer.models : [];
  const currentModelData = availableModels.find(
    (m) => m.name.toLowerCase() === selectedModel.toLowerCase()
  );
  const suggestedVariants = currentModelData?.variants || [];

  // Update auto-rarity whenever make, model, or variant changes
  useEffect(() => {
    const modelToUse = selectedModel === 'custom' ? customModel : selectedModel;
    const variantToUse = selectedVariant === 'custom' ? customVariant : selectedVariant;

    if (modelToUse) {
      const result = calculateAutoRarity(selectedMake, modelToUse, variantToUse);
      setAutoRarity(result.rarity);
      setRarityReason(result.reason);
      setSpecs(result.specs);
      if (!manualRarityOverride) {
        setManualRarity(result.rarity);
      }
    }
  }, [selectedMake, selectedModel, customModel, selectedVariant, customVariant, manualRarityOverride]);

  if (!isOpen) return null;

  // Handle file uploads (converts file to data URL for local storage)
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);

    const fileArray = Array.from(files);
    const compressedUrls: string[] = [];

    for (const file of fileArray) {
      try {
        const compressed = await compressImageFile(file, 1280, 0.85);
        if (compressed) compressedUrls.push(compressed);
      } catch (err) {
        console.warn('Compression fallback to FileReader', err);
      }
    }

    if (compressedUrls.length > 0) {
      setPhotos((prev) => {
        const next = [...prev, ...compressedUrls];
        if (compressedUrls.length === 1) {
          setCropTargetIndex(prev.length);
        }
        return next;
      });
    }
  };

  const handleCaptureLive = (dataUrl: string) => {
    setPhotos((prev) => {
      const next = [...prev, dataUrl];
      setCropTargetIndex(prev.length);
      return next;
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (coverPhotoIndex >= index && coverPhotoIndex > 0) {
      setCoverPhotoIndex((prev) => prev - 1);
    }
  };

  const activeRarity = manualRarityOverride ? manualRarity : autoRarity;
  const rarityConfig = RARITY_CONFIG[activeRarity];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.length === 0) {
      setErrorMsg('Please upload or snap at least one photo of the spotted car.');
      return;
    }

    const finalModel = selectedModel === 'custom' ? customModel.trim() : selectedModel;
    if (!finalModel) {
      setErrorMsg('Please select or specify the car model.');
      return;
    }

    const finalVariant = selectedVariant === 'custom' ? customVariant.trim() : selectedVariant;

    const newSpot: CarSpot = {
      id: `spot-${Date.now()}`,
      make: selectedMake,
      model: finalModel,
      variant: finalVariant || undefined,
      year: new Date().getFullYear(),
      rarity: activeRarity,
      rarityReason: rarityReason || `${rarityConfig.label} rarity classification`,
      photos,
      coverPhotoIndex: coverPhotoIndex < photos.length ? coverPhotoIndex : 0,
      location: location.trim() || 'Unknown Location',
      spottedAt: new Date().toISOString(),
      spotter: spotter.trim() || 'Anonymous Spotter',
      specs,
      notes: notes.trim() || undefined,
      likes: 1,
      isSaved: false
    };

    onAddSpot(newSpot);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div 
          className="relative w-full max-w-2xl bg-[#121216] border border-zinc-800 rounded-t-3xl sm:rounded-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* iOS sheet drag handle affordance */}
          <div className="sm:hidden w-10 h-1 bg-zinc-700 rounded-full mx-auto my-2.5 shrink-0" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Spot a Car</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Register a new exotic find with camera snaps and auto-rarity
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Scrollable */}
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-6 flex-1">
            
            {/* Error Message banner if any */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* SECTION 1: PHOTO CAPTURE & LIBRARY UPLOAD */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                  Vehicle Photos ({photos.length})
                </label>
                <span className="text-[11px] text-zinc-500">
                  Multiple photos supported
                </span>
              </div>

              {/* Action Buttons Row: iPhone Camera & Photo Library */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* 1. Native iPhone Camera button */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="h-16 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 flex flex-col items-center justify-center gap-1 text-zinc-200 hover:text-white active:scale-98 transition-all cursor-pointer group"
                >
                  <Camera className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">iPhone Camera</span>
                </button>

                {/* 2. Photo Library multi-select button */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="h-16 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 flex flex-col items-center justify-center gap-1 text-zinc-200 hover:text-white active:scale-98 transition-all cursor-pointer group"
                >
                  <ImagePlus className="w-5 h-5 text-zinc-300 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Photo Library</span>
                </button>

                {/* 3. Live Viewfinder HUD (Desktop/Mobile in-app HUD) */}
                <button
                  type="button"
                  onClick={() => setIsLiveCameraOpen(true)}
                  className="col-span-2 sm:col-span-1 h-16 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700/80 hover:border-amber-400/50 flex flex-col items-center justify-center gap-1 text-zinc-200 hover:text-white active:scale-98 transition-all cursor-pointer group"
                >
                  <Eye className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">Live Viewfinder</span>
                </button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              {/* Photo Thumbnails Strip */}
              {photos.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Tap star to select primary cover</span>
                    <span>{photos.length} uploaded</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {photos.map((url, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-video rounded-lg overflow-hidden border group ${
                          coverPhotoIndex === idx
                            ? 'border-amber-400 ring-2 ring-amber-400/30'
                            : 'border-zinc-800'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Uploaded angle ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Primary Badge */}
                        {coverPhotoIndex === idx && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-400 text-zinc-950 font-bold text-[9px] uppercase font-mono">
                            Cover
                          </div>
                        )}

                        {/* Action buttons overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setCropTargetIndex(idx)}
                            title="Crop & Center Vehicle"
                            aria-label="Crop and center photo"
                            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-200 hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Crop className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoverPhotoIndex(idx)}
                            aria-label="Set as cover photo"
                            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-200 hover:text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Star className={`w-3.5 h-3.5 ${coverPhotoIndex === idx ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            aria-label="Remove photo"
                            className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-200 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick button to open crop editor for primary cover */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setCropTargetIndex(coverPhotoIndex)}
                      className="h-8 px-3 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-amber-400 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Crop className="w-3.5 h-3.5 text-amber-400" />
                      <span>Crop & Center Vehicle</span>
                    </button>
                    <span className="text-[11px] text-zinc-500">
                      Adjust framing, zoom & horizon level
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: MANUFACTURER & EXACT MODEL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Manufacturer Dropdown */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Manufacturer
                </label>
                <div className="relative">
                  <select
                    value={selectedMake}
                    onChange={(e) => {
                      const newMake = e.target.value;
                      setSelectedMake(newMake);
                      const mfg = MANUFACTURER_CATALOG.find(m => m.name.toLowerCase() === newMake.toLowerCase());
                      if (mfg && mfg.models.length > 0) {
                        setSelectedModel(mfg.models[0].name);
                        setSelectedVariant(mfg.models[0].variants?.[0] || '');
                      } else {
                        setSelectedModel('custom');
                      }
                    }}
                    className="w-full h-11 bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 text-sm text-white appearance-none focus:outline-none focus:border-zinc-400 transition-colors cursor-pointer"
                  >
                    {MANUFACTURER_CATALOG.map((mfg) => (
                      <option key={mfg.name} value={mfg.name} className="bg-zinc-900 text-white">
                        {mfg.name} ({mfg.country})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Exact Model Dropdown */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Exact Model
                </label>
                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={(e) => {
                      const newModel = e.target.value;
                      setSelectedModel(newModel);
                      const mod = availableModels.find(m => m.name === newModel);
                      if (mod && mod.variants && mod.variants.length > 0) {
                        setSelectedVariant(mod.variants[0]);
                      } else {
                        setSelectedVariant('');
                      }
                    }}
                    className="w-full h-11 bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 text-sm text-white appearance-none focus:outline-none focus:border-zinc-400 transition-colors cursor-pointer"
                  >
                    {availableModels.map((m) => (
                      <option key={m.name} value={m.name} className="bg-zinc-900 text-white">
                        {m.name}
                      </option>
                    ))}
                    <option value="custom" className="bg-zinc-900 text-amber-300">
                      + Other / Bespoke Model...
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Custom Model Text Input if "custom" selected */}
            {selectedModel === 'custom' && (
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Enter Custom Model Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. EB110 SS, Carrera 2.7 RS, F40 LM"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  className="w-full h-11 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* SECTION 3: SPECIAL EDITIONS & VARIANTS */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                  Special Edition / Variant
                </label>
                <span className="text-[11px] text-zinc-500">
                  Affects rarity tier
                </span>
              </div>

              {suggestVariantsSection(suggestedVariants, selectedVariant, setSelectedVariant, customVariant, setCustomVariant)}
            </div>

            {/* SECTION 4: AUTOMATIC RARITY ASSIGNMENT DISPLAY */}
            <div className={`p-4 rounded-xl border transition-all ${rarityConfig.bg} ${rarityConfig.border}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Auto-Assigned Rarity:
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${rarityConfig.badge}`}>
                      {rarityConfig.label}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                    {rarityReason || rarityConfig.description}
                  </p>

                  {/* Technical Specs Preview */}
                  {specs.hp && (
                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 pt-1.5">
                      <span>{specs.hp} HP</span>
                      <span>·</span>
                      <span>{specs.engine}</span>
                      {specs.estValue && (
                        <>
                          <span>·</span>
                          <span className="text-zinc-300">{specs.estValue}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Manual override toggle */}
                <button
                  type="button"
                  onClick={() => setManualRarityOverride(!manualRarityOverride)}
                  className="text-[11px] text-zinc-400 hover:text-zinc-200 underline whitespace-nowrap cursor-pointer shrink-0"
                >
                  {manualRarityOverride ? 'Use Auto' : 'Adjust'}
                </button>
              </div>

              {/* Manual Rarity Selector if override enabled */}
              {manualRarityOverride && (
                <div className="mt-3 pt-3 border-t border-zinc-800/80">
                  <span className="block text-[11px] font-mono text-zinc-400 mb-2">
                    Override Rarity Level:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {(['legendary', 'epic', 'rare', 'common'] as RarityTier[]).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setManualRarity(tier)}
                        className={`py-1.5 rounded-lg text-xs font-mono uppercase font-semibold border transition-all cursor-pointer ${
                          manualRarity === tier
                            ? RARITY_CONFIG[tier].badge
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 5: SPOT LOCATION & SPOTTER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Spot Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Monaco, Beverly Hills, Nürburgring"
                    className="w-full h-11 bg-zinc-900 border border-zinc-700/80 rounded-xl pl-9 pr-3.5 text-sm text-white focus:outline-none focus:border-zinc-400"
                  />
                  <MapPin className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Spotter Handle
                </label>
                <input
                  type="text"
                  value={spotter}
                  onChange={(e) => setSpotter(e.target.value)}
                  placeholder="e.g. Alex_Spotter"
                  className="w-full h-11 bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            {/* Notes / Sound description */}
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Spotter Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Exhaust sound, paint color code, owner story, carbon spec..."
                className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-zinc-400 resize-none"
              />
            </div>

            {/* Bottom sticky submission button */}
            <div className="pt-2 pb-safe">
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-98 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Spot to Gallery</span>
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      <LiveCameraModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapture={handleCaptureLive}
      />

      {/* Photo Crop & Reposition Screen */}
      <PhotoCropModal
        isOpen={cropTargetIndex !== null && cropTargetIndex < photos.length}
        imageUrl={cropTargetIndex !== null && cropTargetIndex < photos.length ? photos[cropTargetIndex] : null}
        onClose={() => setCropTargetIndex(null)}
        onSaveCrop={(croppedDataUrl) => {
          if (cropTargetIndex !== null) {
            setPhotos((prev) => {
              const next = [...prev];
              next[cropTargetIndex] = croppedDataUrl;
              return next;
            });
            setCropTargetIndex(null);
          }
        }}
      />
    </>
  );
};

// Helper for rendering variant chips and dropdown
function suggestVariantsSection(
  suggestedVariants: string[],
  selectedVariant: string,
  setSelectedVariant: (v: string) => void,
  customVariant: string,
  setCustomVariant: (v: string) => void
) {
  return (
    <div className="space-y-2">
      {suggestedVariants.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestedVariants.map((variant) => (
            <button
              key={variant}
              type="button"
              onClick={() => setSelectedVariant(variant)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedVariant === variant
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              {variant}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedVariant('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedVariant === 'custom'
                ? 'bg-zinc-100 text-zinc-950 font-semibold'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            + Custom Spec
          </button>
        </div>
      )}

      {selectedVariant === 'custom' && (
        <input
          type="text"
          placeholder="e.g. 1 of 1 Paint to Sample Viola Pasifae, Mansory Carbon"
          value={customVariant}
          onChange={(e) => setCustomVariant(e.target.value)}
          className="w-full h-11 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-amber-400 mt-2"
        />
      )}
    </div>
  );
}

function compressImageFile(file: File, maxDim = 1280, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve((e.target?.result as string) || '');
        }
      };
      img.onerror = () => resolve((e.target?.result as string) || '');
      img.src = (e.target?.result as string) || '';
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
