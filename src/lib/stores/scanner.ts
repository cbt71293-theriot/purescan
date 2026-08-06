import { writable, type Readable } from "svelte/store";

export interface ScanResult {
  id: string;
  barcode?: string;
  productName?: string;
  brand?: string;
  image?: string;
  ingredientsText?: string;
  additives?: AdditiveInfo[];
  score?: number;
  scannedAt: string;
}

export interface AdditiveInfo {
  code: string;
  name: string;
  riskLevel: "low" | "medium" | "high";
  description: string;
}

function createScannerStore() {
  const { subscribe, set, update } = writable<ScanResult | null>(null);

  return {
    subscribe,
    set,
    update,
    clear() {
      set(null);
    }
  };
}

export const scanResult = createScannerStore();

export const isScanning = writable(false);
export const scanError = writable<string | null>(null);
