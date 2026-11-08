import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  collection, 
  getDoc,
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  getDocFromServer,
  increment
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { CarSpot } from './types/spotter';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom Database ID (CRITICAL: The app will break without this line)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling Infrastructure as required by Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection on initial load
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or connection pending:', error.message);
      return false;
    }
    // Permissions error on /test/connection is normal if test document is not readable;
    // but connectivity succeeded
    return true;
  }
}

// Auth Actions
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Store user record in /users
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        uid: result.user.uid,
        displayName: result.user.displayName || 'Spotter',
        photoURL: result.user.photoURL || '',
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
    return result.user;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// Firestore Database Operations with strict error handling

export function subscribeToSpots(
  onData: (spots: CarSpot[]) => void,
  onError?: (err: any) => void
): () => void {
  const path = 'spots';
  const spotsQuery = query(collection(db, path));

  return onSnapshot(
    spotsQuery,
    (snapshot) => {
      const items: CarSpot[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          make: data.make || 'Unknown',
          model: data.model || 'Unknown',
          variant: data.variant || '',
          year: data.year || new Date().getFullYear(),
          rarity: data.rarity || 'common',
          rarityReason: data.rarityReason || '',
          photos: Array.isArray(data.photos) ? data.photos : [],
          coverPhotoIndex: data.coverPhotoIndex || 0,
          location: data.location || 'Unknown',
          spottedAt: data.spottedAt || new Date().toISOString(),
          spotter: data.spotter || 'Anonymous',
          specs: data.specs || {},
          notes: data.notes || '',
          likes: typeof data.likes === 'number' ? data.likes : 0,
          isSaved: false
        });
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function createSpotInFirestore(spot: CarSpot): Promise<void> {
  const path = `spots/${spot.id}`;
  try {
    const spotRef = doc(db, 'spots', spot.id);
    
    // Clean specs to ensure no undefined properties exist
    const cleanSpecs: Record<string, any> = {};
    if (spot.specs && typeof spot.specs === 'object') {
      Object.entries(spot.specs).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          cleanSpecs[k] = v;
        }
      });
    }

    const payload = {
      make: spot.make,
      model: spot.model,
      variant: spot.variant || '',
      year: spot.year || new Date().getFullYear(),
      rarity: spot.rarity,
      rarityReason: spot.rarityReason || '',
      photos: spot.photos,
      coverPhotoIndex: spot.coverPhotoIndex || 0,
      location: spot.location,
      spottedAt: spot.spottedAt,
      spotter: spot.spotter,
      specs: cleanSpecs,
      notes: spot.notes || '',
      likes: typeof spot.likes === 'number' ? spot.likes : 0,
      createdAt: new Date().toISOString(),
      userId: auth.currentUser?.uid || ''
    };
    await setDoc(spotRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function upvoteSpotInFirestore(spotId: string, currentLikes: number): Promise<void> {
  const path = `spots/${spotId}`;
  try {
    const spotRef = doc(db, 'spots', spotId);
    await updateDoc(spotRef, {
      likes: currentLikes + 1
    });

    // Also record in user likes subcollection if authenticated
    if (auth.currentUser) {
      const likeRef = doc(db, 'spots', spotId, 'likes', auth.currentUser.uid);
      await setDoc(likeRef, {
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addPhotosToSpotInFirestore(spotId: string, currentPhotos: string[], newPhotos: string[]): Promise<void> {
  const path = `spots/${spotId}`;
  try {
    const spotRef = doc(db, 'spots', spotId);
    await updateDoc(spotRef, {
      photos: [...currentPhotos, ...newPhotos]
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteSpotFromFirestore(spotId: string): Promise<void> {
  const path = `spots/${spotId}`;
  try {
    const spotRef = doc(db, 'spots', spotId);
    await deleteDoc(spotRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
