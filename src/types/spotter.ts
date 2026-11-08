export type RarityTier = 'legendary' | 'epic' | 'rare' | 'common';

export interface CarSpecs {
  hp?: number;
  engine?: string;
  topSpeedMph?: number;
  zeroToSixtySec?: number;
  estValue?: string;
  productionUnits?: string;
}

export interface CarSpot {
  id: string;
  make: string;
  model: string;
  variant?: string;
  year?: number;
  rarity: RarityTier;
  rarityReason: string;
  photos: string[];
  coverPhotoIndex: number;
  location: string;
  spottedAt: string; // ISO date string or formatted date
  spotter: string;
  specs: CarSpecs;
  notes?: string;
  likes: number;
  isSaved?: boolean;
  userId?: string;
}

export interface ModelEntry {
  name: string;
  defaultRarity: RarityTier;
  variants?: string[];
  rarityReason: string;
  specs: CarSpecs;
}

export interface ManufacturerEntry {
  name: string;
  country: string;
  popular?: boolean;
  models: ModelEntry[];
}
