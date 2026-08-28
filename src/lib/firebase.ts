import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  measurementId: firebaseConfigJson.measurementId,
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if provided
const databaseId = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? firebaseConfigJson.firestoreDatabaseId
  : undefined;

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
export const auth = getAuth(app);

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);
};

// Generic Firestore Helpers
export function sanitizeForFirestore(val: any): any {
  if (val === undefined) return null;
  if (val === null || typeof val !== 'object') return val;
  if (val instanceof Date) return val.toISOString();
  
  if (Array.isArray(val)) {
    return val.map((item) => {
      if (Array.isArray(item)) {
        // Flatten / convert coordinate pairs or nested arrays
        if (item.length === 2 && typeof item[0] === 'number' && typeof item[1] === 'number') {
          return { lat: item[0], lng: item[1] };
        }
        return { values: sanitizeForFirestore(item) };
      }
      return sanitizeForFirestore(item);
    });
  }

  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(val)) {
    const v = val[key];
    if (v !== undefined) {
      cleaned[key] = sanitizeForFirestore(v);
    }
  }
  return cleaned;
}

export function deserializeFromFirestore(val: any): any {
  if (val === null || val === undefined || typeof val !== 'object') return val;
  
  if (Array.isArray(val)) {
    return val.map((item) => {
      if (
        item && 
        typeof item === 'object' && 
        'lat' in item && 
        'lng' in item && 
        Object.keys(item).length === 2 && 
        typeof item.lat === 'number' && 
        typeof item.lng === 'number'
      ) {
        return [item.lat, item.lng];
      }
      if (item && typeof item === 'object' && 'values' in item) {
        return deserializeFromFirestore(item.values);
      }
      return deserializeFromFirestore(item);
    });
  }

  const result: Record<string, any> = {};
  for (const key of Object.keys(val)) {
    result[key] = deserializeFromFirestore(val[key]);
  }
  return result;
}

export async function fetchCollectionDocs<T = DocumentData>(collectionName: string): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snap: QuerySnapshot<DocumentData> = await getDocs(colRef);
    const results: T[] = [];
    snap.forEach(d => {
      results.push({ id: d.id, ...deserializeFromFirestore(d.data()) } as T);
    });
    return results;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
}

export async function saveDocToFirestore<T extends Record<string, any>>(
  collectionName: string, 
  docId: string, 
  data: T
): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    const cleanData = sanitizeForFirestore(data);
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (error) {
    console.error(`Error saving doc ${docId} to ${collectionName}:`, error);
    return false;
  }
}

export async function deleteDocFromFirestore(collectionName: string, docId: string): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting doc ${docId} from ${collectionName}:`, error);
    return false;
  }
}

export async function batchSaveCollection<T extends { id: string }>(
  collectionName: string, 
  items: T[]
): Promise<boolean> {
  try {
    const batch = writeBatch(db);
    for (const item of items) {
      if (!item.id) continue;
      const docRef = doc(db, collectionName, item.id);
      const cleanData = sanitizeForFirestore(item);
      batch.set(docRef, cleanData, { merge: true });
    }
    await batch.commit();
    return true;
  } catch (error) {
    console.error(`Error batch saving ${collectionName}:`, error);
    return false;
  }
}

// Subscribe to real-time updates for a collection
export function subscribeToCollection<T = DocumentData>(
  collectionName: string,
  onUpdate: (docs: T[]) => void
) {
  const colRef = collection(db, collectionName);
  return onSnapshot(colRef, (snap) => {
    const results: T[] = [];
    snap.forEach(d => {
      results.push({ id: d.id, ...deserializeFromFirestore(d.data()) } as T);
    });
    onUpdate(results);
  }, (err) => {
    console.warn(`Realtime subscription error for ${collectionName}:`, err);
  });
}

// Subscribe to a single document
export function subscribeToDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  onUpdate: (data: T | null) => void
) {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      onUpdate({ id: snap.id, ...deserializeFromFirestore(snap.data()) } as T);
    } else {
      onUpdate(null);
    }
  }, (err) => {
    console.warn(`Realtime doc subscription error for ${collectionName}/${docId}:`, err);
  });
}
