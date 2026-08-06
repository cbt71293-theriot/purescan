export interface AdditiveAnalysis {
  code: string;
  name: string;
  riskLevel: "low" | "medium" | "high";
  description: string;
  sources: string[];
}

// Placeholder additive rules. Replace with real data/API integration.
const additiveRules: Record<string, AdditiveAnalysis> = {
  E100: {
    code: "E100",
    name: "Turmeric",
    riskLevel: "low",
    description: "Natural colorant derived from turmeric root, widely considered safe.",
    sources: ["EFSA", "OpenFoodFacts"]
  },
  E621: {
    code: "E621",
    name: "Monosodium Glutamate (MSG)",
    riskLevel: "medium",
    description: "Flavor enhancer. Some individuals report sensitivity. Generally recognized as safe by FDA.",
    sources: ["FDA", "OpenFoodFacts"]
  }
};

export function analyzeAdditives(
  ingredientsText?: string
): AdditiveAnalysis[] {
  if (!ingredientsText) return [];

  const found: AdditiveAnalysis[] = [];
  const eCodes = ingredientsText.match(/E\d{3,4}[A-Za-z]?/gi) || [];

  for (const code of eCodes) {
    const upper = code.toUpperCase();
    if (additiveRules[upper]) {
      found.push(additiveRules[upper]);
    } else {
      found.push({
        code: upper,
        name: upper,
        riskLevel: "medium",
        description: "Additive with limited public safety notes in this demo dataset.",
        sources: []
      });
    }
  }

  return found;
}
