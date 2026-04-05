import { collection, doc, getDoc, getDocs, setDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export interface Property {
  id: string;
  name: string;
  location: string;
  type: string;
  description: string;
  targetVolume: number;
  yield: number;
  funded: number;
  holdingPeriod: string;
  tokenSymbol: string;
  tokenPrice: number;
  shariaStructure: string;
  image: string;
  documents: any[];
  status: "Draft" | "Live" | "Funded";
  createdAt: any;
  // Objektdaten
  livingArea: number;
  plotArea: number;
  yearBuilt: number;
  floors: number;
  energyRating: string;
  parkingSpaces: number;
  occupancyRate: number;
  monthlyRent: number;
  annualNetIncome: number;
  minInvest: number;
  maxInvest: number;
  units: number;
  highlights: string[];
}

export async function getLiveProperties(): Promise<Property[]> {
  if (!db) return [];
  const q = query(collection(db, "properties"), where("status", "==", "Live"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
}

export async function getPropertyById(id: string): Promise<Property | null> {
  if (!db) return null;
  const docRef = doc(db, "properties", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Property;
  }
  return null;
}

export async function addProperty(propertyData: Partial<Property>) {
  if (!db) throw new Error("Firestore is not initialized");
  const newRef = doc(collection(db, "properties"));
  await setDoc(newRef, {
    ...propertyData,
    id: newRef.id,
    createdAt: Timestamp.now()
  });
  return newRef.id;
}
