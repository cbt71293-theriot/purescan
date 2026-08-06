import { writable, type Readable } from "svelte/store";

export interface AdditiveInfo {
  code: string;
  name: string;
  riskLevel: "low" | "medium" | "high";
  description: string;
}

export interface ScanResult {
  id: string;
  barcode?: string;
  productName?: string;
  brand?: string;
  image?: string;
  ingredientsText?: string;
  additives?: AdditiveInfo[];
  score?: number;
  level?: "A" | "B" | "C" | "D" | "F";
  rationale?: string;
  scannedAt: string;
}

export interface RuleMatch {
  ingredient: string;
  ruleType: "allergy" | "redLine" | "diet";
  profileName: string;
  severity: "block" | "warn" | "info";
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
