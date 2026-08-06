export interface AdditiveAnalysis {
  code: string;
  name: string;
  riskLevel: "low" | "medium" | "high" | "unknown";
  description: string;
  sources: string[];
}

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
  },
  E102: {
    code: "E102",
    name: "Tartrazine",
    riskLevel: "high",
    description: "Synthetic azo dye. Associated with hypersensitivity reactions in sensitive individuals.",
    sources: ["FDA", "EFSA"]
  },
  E110: {
    code: "E110",
    name: "Sunset Yellow FCF",
    riskLevel: "high",
    description: "Synthetic dye. May cause hyperactivity or allergic reactions in children.",
    sources: ["FDA", "EFSA"]
  },
  E129: {
    code: "E129",
    name: "Allura Red AC",
    riskLevel: "high",
    description: "Synthetic red dye. Associated with behavioral effects in sensitive individuals.",
    sources: ["FDA", "EFSA"]
  },
  E133: {
    code: "E133",
    name: "Brilliant Blue FCF",
    riskLevel: "medium",
    description: "Synthetic blue dye. Considered safe at approved levels, but some users report sensitivity.",
    sources: ["FDA", "EFSA"]
  },
  E250: {
    code: "E250",
    name: "Sodium Nitrite",
    riskLevel: "high",
    description: "Preservative used in cured meats. Can form nitrosamines under high heat.",
    sources: ["FDA", "EFSA"]
  },
  E220: {
    code: "E220",
    name: "Sulfur Dioxide",
    riskLevel: "high",
    description: "Preservative and antioxidant. Can trigger asthma and allergic reactions.",
    sources: ["FDA", "EFSA"]
  },
  E407: {
    code: "E407",
    name: "Carrageenan",
    riskLevel: "medium",
    description: "Seaweed-derived thickener. Some studies suggest gastrointestinal inflammation in sensitive individuals.",
    sources: ["EFSA", "OpenFoodFacts"]
  }
};

export function analyzeAdditives(ingredientsText?: string): AdditiveAnalysis[] {
  if (!ingredientsText) return [];

  const found: AdditiveAnalysis[] = [];
  const eCodes = ingredientsText.match(/E\d{3,4}[A-Za-z]?/gi) || [];

  for (const code of eCodes) {
    const upper = code.toUpperCase();
    const known = additiveRules[upper];
    found.push(
      known
        ? { ...known }
        : {
            code: upper,
            name: upper,
            riskLevel: "medium",
            description: "Additive with limited public safety notes in this demo dataset.",
            sources: []
          }
    );
  }

  return found;
}
