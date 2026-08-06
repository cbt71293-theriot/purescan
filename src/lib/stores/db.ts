import Dexie, { type Table } from "dexie";

export interface ScanHistoryItem {
  id?: number;
  scanId: string;
  barcode?: string;
  productName?: string;
  brand?: string;
  additivesJson: string;
  score: number;
  scannedAt: string;
  syncedAt?: string;
}

export interface Profile {
  id: string;
  name: string;
  diets: string[];
  allergies: string[];
  redLines: string[];
  goals: string[];
  healthDataEnabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface PantryItem {
  id: string;
  barcode: string;
  product: any;
  addedAt: number;
  expiresAt?: number;
  quantity?: number;
  unit?: string;
}

class PureScanDb extends Dexie {
  scans!: Table<ScanHistoryItem, number>;
  profiles!: Table<Profile, string>;
  pantry!: Table<PantryItem, string>;

  constructor() {
    super("purescan");
    this.version(1).stores({
      scans: "id, scanId, barcode, productName, scannedAt, syncedAt",
      profiles: "id",
      pantry: "barcode, expiresAt"
    });
  }
}

export const db = new PureScanDb();
