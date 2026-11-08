import { CarSpot } from '../types/spotter';
import { INITIAL_CAR_SPOTS } from '../data/initialSpots';

const STORAGE_KEY = 'spotter_cars_v1';

export function getStoredSpots(): CarSpot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CAR_SPOTS));
      return INITIAL_CAR_SPOTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge any new photos from initial spots if they were updated
      const merged = parsed.map((item: CarSpot) => {
        const seed = INITIAL_CAR_SPOTS.find(s => s.id === item.id);
        if (seed && seed.photos.length > item.photos.length) {
          return { ...item, photos: seed.photos };
        }
        return item;
      });
      return merged;
    }
    return INITIAL_CAR_SPOTS;
  } catch (err) {
    console.error('Failed to read spots from localStorage', err);
    return INITIAL_CAR_SPOTS;
  }
}

export function saveSpots(spots: CarSpot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
  } catch (err) {
    console.warn('LocalStorage save failed, trying quota-managed save', err);
    // If quota exceeded due to large base64 photos, compress or trim oldest non-saved photos
    try {
      const trimmed = spots.map(s => ({
        ...s,
        // keep up to 3 photos if too heavy
        photos: s.photos.slice(0, 3)
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (innerErr) {
      console.error('Critical storage error', innerErr);
    }
  }
}
