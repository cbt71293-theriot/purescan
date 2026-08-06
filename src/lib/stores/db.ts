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

class PureScanDb extends Dexie {
  scans!: Table<ScanHistoryItem, number>;

  constructor() {
    super("purescan");
    this.version(1).stores({
      scans: "id, scanId, barcode, productName, scannedAt, syncedAt"
    });
  }
}

export const db = new PureScanDb();
