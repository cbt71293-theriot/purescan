export interface Product {
  barcode: string;
  name: string;
  brand?: string;
  ingredients: string[];
  additives: Additive[];
  score: number;
  level: 'A' | 'B' | 'C' | 'D' | 'F';
  category?: string;
  imageUrl?: string;
  lastUpdated: number;
  source: string;
}

export interface Additive {
  code: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  description: string;
  regulatoryStatus: string;
  sources: string[];
  lastReviewed: number;
}

export interface Scan {
  id: string;
  timestamp: number;
  barcode: string;
  product: Product;
  userId?: string;
  mealContext?: string;
  notes?: string;
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
  product: Product;
  addedAt: number;
  expiresAt?: number;
  quantity?: number;
  unit?: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: number;
  lastSyncAt?: number;
  settings: {
    syncEnabled: boolean;
    analyticsEnabled: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface ScoreResult {
  level: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  rationale: string;
  breakdown: ScoreBreakdownItem[];
}

export interface ScoreBreakdownItem {
  ingredient: string;
  risk: 'low' | 'medium' | 'high' | 'unknown';
  weight: number;
}

export interface AdditiveAnalysis {
  code: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  description: string;
  sources: string[];
}

export interface RuleMatch {
  ingredient: string;
  ruleType: 'allergy' | 'redLine' | 'diet';
  profileName: string;
  severity: 'block' | 'warn' | 'info';
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}
